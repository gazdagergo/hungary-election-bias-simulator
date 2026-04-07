/**
 * Hungarian Electoral System Seat Calculation
 *
 * Simplified model inspired by taktikaiszavazas.hu methodology.
 * Models Hungary's mixed electoral system:
 * - 106 Single-Member District (SMD) seats: Winner-take-all
 * - 93 National List seats: D'Hondt proportional distribution
 * - 5% parliamentary threshold for parties
 * - Fidesz ~1% structural SMD advantage
 * - Non-linear winner bonus for SMD seats
 *
 * Note: This is a simplified model for understanding biases.
 * taktikaiszavazas.hu uses district-level data and turnout modeling
 * for more precise forecasting.
 */

export const TOTAL_SEATS = 199
export const SMD_SEATS = 106  // Single-member district seats (winner-take-all)
export const LIST_SEATS = 93  // National list seats (proportional, D'Hondt)
export const PARLIAMENTARY_THRESHOLD = 5  // 5% threshold for parliament entry

export interface VoteShare {
  tisza: number
  fidesz: number
  smallParty: number
}

export interface PartySeats {
  tisza: number
  fidesz: number
  smallParty: number
}

/**
 * D'Hondt proportional allocation algorithm
 * Allocates seats one by one, always giving to the party with highest quotient
 * Quotient = votes / (seats_already_won + 1)
 */
export function dHondtAllocate(
  votes: VoteShare,
  seats: number,
  includeSmallParty: boolean
): PartySeats {
  const result: PartySeats = { tisza: 0, fidesz: 0, smallParty: 0 }

  for (let i = 0; i < seats; i++) {
    const quotients: { party: keyof PartySeats; value: number }[] = [
      { party: 'tisza', value: votes.tisza / (result.tisza + 1) },
      { party: 'fidesz', value: votes.fidesz / (result.fidesz + 1) },
    ]
    if (includeSmallParty && votes.smallParty > 0) {
      quotients.push({ party: 'smallParty', value: votes.smallParty / (result.smallParty + 1) })
    }

    // Find party with highest quotient and give them the seat
    const winner = quotients.reduce((max, curr) => curr.value > max.value ? curr : max)
    result[winner.party]++
  }

  return result
}

/**
 * Calculate SMD (Single-Member District) seats
 *
 * SMD seats are winner-take-all with non-linear scaling:
 * - When parties are close, seats split more evenly
 * - When one dominates, they take most seats
 * - Fidesz has ~1% structural advantage in SMD vs list performance
 * - Small parties get 0 SMD seats (can't win plurality in any district)
 */
export function calculateSmdSeats(
  votes: VoteShare,
  fideszSmdBonus: number = 0.01
): { tisza: number; fidesz: number } {
  const majorPartyTotal = votes.tisza + votes.fidesz

  if (majorPartyTotal === 0) {
    return { tisza: 0, fidesz: 0 }
  }

  const tiszaShare = votes.tisza / majorPartyTotal
  const fideszShare = votes.fidesz / majorPartyTotal

  // SMD bonus for Fidesz (~1% overperformance in SMD)
  const adjustedFideszSmdShare = Math.min(1, fideszShare + fideszSmdBonus)
  const adjustedTiszaSmdShare = 1 - adjustedFideszSmdShare

  // SMD seats are winner-take-all with non-linear scaling
  // Using sigmoid-like curve to model dominance effect
  const smdDominanceFactor = Math.abs(adjustedFideszSmdShare - adjustedTiszaSmdShare) * 2
  const smdWinnerBonus = Math.min(0.3, smdDominanceFactor * 0.5) // Up to 30% bonus for dominance

  let smdTisza: number, smdFidesz: number
  if (adjustedTiszaSmdShare > adjustedFideszSmdShare) {
    smdTisza = Math.round(SMD_SEATS * (adjustedTiszaSmdShare + smdWinnerBonus))
    smdFidesz = SMD_SEATS - smdTisza
  } else {
    smdFidesz = Math.round(SMD_SEATS * (adjustedFideszSmdShare + smdWinnerBonus))
    smdTisza = SMD_SEATS - smdFidesz
  }

  // Clamp to valid range
  smdTisza = Math.max(0, Math.min(SMD_SEATS, smdTisza))
  smdFidesz = SMD_SEATS - smdTisza

  return { tisza: smdTisza, fidesz: smdFidesz }
}

/**
 * Calculate proportional seat distribution using Hungarian mixed system
 *
 * @param votes - Vote percentages for each party
 * @param fideszSmdBonus - Fidesz structural advantage in SMD (default 1%)
 * @returns Seat distribution for each party
 */
export function calculateProportionalSeats(
  votes: VoteShare,
  fideszSmdBonus: number = 0.01
): PartySeats {
  const smallPartyPassesThreshold = votes.smallParty >= PARLIAMENTARY_THRESHOLD
  const qualifyingSmallParty = smallPartyPassesThreshold ? votes.smallParty : 0
  const majorPartyTotal = votes.tisza + votes.fidesz

  if (majorPartyTotal === 0) {
    return { tisza: 0, fidesz: 0, smallParty: 0 }
  }

  // Calculate SMD seats (small parties get 0)
  const smdSeats = calculateSmdSeats(votes, fideszSmdBonus)

  // Calculate list seats using D'Hondt
  const listSeats = dHondtAllocate(
    { tisza: votes.tisza, fidesz: votes.fidesz, smallParty: qualifyingSmallParty },
    LIST_SEATS,
    smallPartyPassesThreshold
  )

  return {
    tisza: smdSeats.tisza + listSeats.tisza,
    fidesz: smdSeats.fidesz + listSeats.fidesz,
    smallParty: listSeats.smallParty, // Small parties only get list seats
  }
}

/**
 * Apply seat biases (system weighting, minority MP, etc.)
 *
 * @param proportionalSeats - Base seat distribution
 * @param fideszBias - Seats to transfer from Tisza to Fidesz
 * @param winnerBias - Seats to transfer from loser to winner
 * @param winner - Which party is currently leading
 * @returns Final seat distribution after biases
 */
export function applyBiases(
  proportionalSeats: PartySeats,
  fideszBias: number,
  winnerBias: number,
  winner: 'tisza' | 'fidesz'
): PartySeats {
  let tisza = proportionalSeats.tisza
  let fidesz = proportionalSeats.fidesz
  const smallParty = proportionalSeats.smallParty

  // Fidesz bias: transfer seats from Tisza to Fidesz
  const actualFideszBias = Math.min(fideszBias, tisza)
  fidesz += actualFideszBias
  tisza -= actualFideszBias

  // Winner bias: transfer seats from loser to winner
  if (winner === 'tisza') {
    const actualWinnerBias = Math.min(winnerBias, fidesz)
    tisza += actualWinnerBias
    fidesz -= actualWinnerBias
  } else {
    const actualWinnerBias = Math.min(winnerBias, tisza)
    fidesz += actualWinnerBias
    tisza -= actualWinnerBias
  }

  return { tisza, fidesz, smallParty }
}

/**
 * Full seat calculation with all biases
 * This is the main function used by the visualization
 */
export function calculateFinalSeats(
  votes: VoteShare,
  options: {
    fideszSmdBonus?: number
    fideszBias?: number
    winnerBias?: number
  } = {}
): PartySeats {
  const {
    fideszSmdBonus = 0.01,
    fideszBias = 0,
    winnerBias = 0,
  } = options

  const proportionalSeats = calculateProportionalSeats(votes, fideszSmdBonus)
  const winner: 'tisza' | 'fidesz' = votes.tisza >= votes.fidesz ? 'tisza' : 'fidesz'

  return applyBiases(proportionalSeats, fideszBias, winnerBias, winner)
}
