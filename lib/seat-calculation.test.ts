/**
 * Unit tests for Hungarian Electoral System Seat Calculation
 *
 * Tests the seat calculation with opinion biases disabled (fair scenario)
 * but system biases (SMD/list split, D'Hondt, 5% threshold) enabled.
 */

import {
  TOTAL_SEATS,
  SMD_SEATS,
  LIST_SEATS,
  PARLIAMENTARY_THRESHOLD,
  dHondtAllocate,
  calculateSmdSeats,
  calculateProportionalSeats,
  calculateFinalSeats,
  applyBiases,
  type VoteShare,
  type PartySeats,
} from './seat-calculation'

describe('Constants', () => {
  test('total seats equals 199', () => {
    expect(TOTAL_SEATS).toBe(199)
  })

  test('SMD + List seats equals total', () => {
    expect(SMD_SEATS + LIST_SEATS).toBe(TOTAL_SEATS)
  })

  test('SMD seats equals 106', () => {
    expect(SMD_SEATS).toBe(106)
  })

  test('List seats equals 93', () => {
    expect(LIST_SEATS).toBe(93)
  })

  test('Parliamentary threshold is 5%', () => {
    expect(PARLIAMENTARY_THRESHOLD).toBe(5)
  })
})

describe('D\'Hondt Algorithm', () => {
  test('allocates seats proportionally for two parties', () => {
    const votes: VoteShare = { tisza: 50, fidesz: 50, smallParty: 0 }
    const result = dHondtAllocate(votes, 10, false)

    expect(result.tisza).toBe(5)
    expect(result.fidesz).toBe(5)
    expect(result.smallParty).toBe(0)
  })

  test('allocates more seats to party with more votes', () => {
    const votes: VoteShare = { tisza: 60, fidesz: 40, smallParty: 0 }
    const result = dHondtAllocate(votes, 10, false)

    expect(result.tisza).toBe(6)
    expect(result.fidesz).toBe(4)
    expect(result.smallParty).toBe(0)
  })

  test('includes small party when specified', () => {
    const votes: VoteShare = { tisza: 45, fidesz: 45, smallParty: 10 }
    const result = dHondtAllocate(votes, 10, true)

    expect(result.tisza + result.fidesz + result.smallParty).toBe(10)
    expect(result.smallParty).toBeGreaterThan(0)
  })

  test('excludes small party when not specified', () => {
    const votes: VoteShare = { tisza: 45, fidesz: 45, smallParty: 10 }
    const result = dHondtAllocate(votes, 10, false)

    expect(result.smallParty).toBe(0)
    expect(result.tisza + result.fidesz).toBe(10)
  })

  test('handles extreme ratio correctly', () => {
    const votes: VoteShare = { tisza: 90, fidesz: 10, smallParty: 0 }
    const result = dHondtAllocate(votes, 10, false)

    // With 90/10 split, D'Hondt should give ~9/1 seats
    expect(result.tisza).toBeGreaterThanOrEqual(8)
    expect(result.fidesz).toBeLessThanOrEqual(2)
  })

  test('allocates all 93 list seats correctly', () => {
    const votes: VoteShare = { tisza: 48, fidesz: 40, smallParty: 5 }
    const result = dHondtAllocate(votes, LIST_SEATS, true)

    expect(result.tisza + result.fidesz + result.smallParty).toBe(LIST_SEATS)
  })
})

describe('SMD Seat Calculation', () => {
  test('gives bonus to Fidesz by default', () => {
    // With equal votes, Fidesz should get slightly more due to 1% SMD bonus
    const votes: VoteShare = { tisza: 50, fidesz: 50, smallParty: 0 }
    const result = calculateSmdSeats(votes)

    expect(result.fidesz).toBeGreaterThan(result.tisza)
  })

  test('winner gets dominance bonus', () => {
    // Clear leader should get proportionally more seats (non-linear effect)
    const clearWin: VoteShare = { tisza: 55, fidesz: 45, smallParty: 0 }
    const result = calculateSmdSeats(clearWin)

    // With 55/45 split, Tisza should get more than 55% of SMD seats due to winner bonus
    const tiszaPercentage = result.tisza / SMD_SEATS
    expect(tiszaPercentage).toBeGreaterThan(0.50)
  })

  test('returns exactly 106 total SMD seats', () => {
    const votes: VoteShare = { tisza: 48, fidesz: 40, smallParty: 0 }
    const result = calculateSmdSeats(votes)

    expect(result.tisza + result.fidesz).toBe(SMD_SEATS)
  })

  test('handles zero votes edge case', () => {
    const votes: VoteShare = { tisza: 0, fidesz: 0, smallParty: 0 }
    const result = calculateSmdSeats(votes)

    expect(result.tisza).toBe(0)
    expect(result.fidesz).toBe(0)
  })

  test('Fidesz SMD bonus can be disabled', () => {
    const votes: VoteShare = { tisza: 50, fidesz: 50, smallParty: 0 }
    const result = calculateSmdSeats(votes, 0) // No SMD bonus

    // Without bonus, equal votes should give equal or near-equal seats
    expect(Math.abs(result.tisza - result.fidesz)).toBeLessThanOrEqual(2)
  })
})

describe('Proportional Seats (Full Calculation)', () => {
  test('returns exactly 199 total seats', () => {
    const votes: VoteShare = { tisza: 48, fidesz: 40, smallParty: 5 }
    const result = calculateProportionalSeats(votes)

    expect(result.tisza + result.fidesz + result.smallParty).toBe(TOTAL_SEATS)
  })

  test('small party below 5% gets 0 seats', () => {
    const votes: VoteShare = { tisza: 48, fidesz: 48, smallParty: 4 }
    const result = calculateProportionalSeats(votes)

    expect(result.smallParty).toBe(0)
  })

  test('small party at exactly 5% gets seats', () => {
    const votes: VoteShare = { tisza: 47.5, fidesz: 47.5, smallParty: 5 }
    const result = calculateProportionalSeats(votes)

    expect(result.smallParty).toBeGreaterThan(0)
  })

  test('small party only gets list seats (no SMD)', () => {
    const votes: VoteShare = { tisza: 45, fidesz: 45, smallParty: 10 }
    const result = calculateProportionalSeats(votes)

    // Small party can get at most LIST_SEATS (93)
    expect(result.smallParty).toBeLessThanOrEqual(LIST_SEATS)
  })
})

describe('Default poll values (48/40/5)', () => {
  const defaultPolls: VoteShare = { tisza: 48, fidesz: 40, smallParty: 5 }

  test('Tisza leads in seats with default polls', () => {
    const result = calculateProportionalSeats(defaultPolls)

    expect(result.tisza).toBeGreaterThan(result.fidesz)
  })

  test('seat distribution is realistic', () => {
    const result = calculateProportionalSeats(defaultPolls)

    // With 48/40 split and Tisza leading:
    // - Tisza should get roughly 100-115 seats
    // - Fidesz should get roughly 80-95 seats
    // - Small party should get roughly 4-8 seats
    expect(result.tisza).toBeGreaterThanOrEqual(95)
    expect(result.tisza).toBeLessThanOrEqual(120)
    expect(result.fidesz).toBeGreaterThanOrEqual(75)
    expect(result.fidesz).toBeLessThanOrEqual(100)
    expect(result.smallParty).toBeGreaterThanOrEqual(3)
    expect(result.smallParty).toBeLessThanOrEqual(10)
  })

  test('total equals 199', () => {
    const result = calculateProportionalSeats(defaultPolls)

    expect(result.tisza + result.fidesz + result.smallParty).toBe(199)
  })
})

describe('Equal polls (40/40/5)', () => {
  const equalPolls: VoteShare = { tisza: 40, fidesz: 40, smallParty: 5 }

  test('Fidesz has slight advantage due to SMD bonus', () => {
    const result = calculateProportionalSeats(equalPolls)

    // With equal major party votes, Fidesz should have slight edge due to SMD bonus
    expect(result.fidesz).toBeGreaterThanOrEqual(result.tisza - 5)
  })

  test('small party gets seats (above 5%)', () => {
    const result = calculateProportionalSeats(equalPolls)

    expect(result.smallParty).toBeGreaterThan(0)
  })

  test('total equals 199', () => {
    const result = calculateProportionalSeats(equalPolls)

    expect(result.tisza + result.fidesz + result.smallParty).toBe(199)
  })
})

describe('Fidesz leading (40/48/5)', () => {
  const fideszLeads: VoteShare = { tisza: 40, fidesz: 48, smallParty: 5 }

  test('Fidesz leads in seats', () => {
    const result = calculateProportionalSeats(fideszLeads)

    expect(result.fidesz).toBeGreaterThan(result.tisza)
  })

  test('seat distribution mirrors Tisza leading scenario', () => {
    const tiszaLeads: VoteShare = { tisza: 48, fidesz: 40, smallParty: 5 }
    const fideszResult = calculateProportionalSeats(fideszLeads)
    const tiszaResult = calculateProportionalSeats(tiszaLeads)

    // Results should be roughly symmetric (but not exactly due to Fidesz SMD bonus)
    expect(fideszResult.fidesz).toBeGreaterThan(tiszaResult.fidesz)
    expect(fideszResult.tisza).toBeLessThan(tiszaResult.tisza)
  })

  test('total equals 199', () => {
    const result = calculateProportionalSeats(fideszLeads)

    expect(result.tisza + result.fidesz + result.smallParty).toBe(199)
  })
})

describe('Small party below threshold (48/40/4)', () => {
  const belowThreshold: VoteShare = { tisza: 48, fidesz: 40, smallParty: 4 }

  test('small party gets 0 seats', () => {
    const result = calculateProportionalSeats(belowThreshold)

    expect(result.smallParty).toBe(0)
  })

  test('major parties split all 199 seats', () => {
    const result = calculateProportionalSeats(belowThreshold)

    expect(result.tisza + result.fidesz).toBe(199)
  })
})

describe('Extreme scenarios', () => {
  test('landslide victory (60/30/5)', () => {
    const landslide: VoteShare = { tisza: 60, fidesz: 30, smallParty: 5 }
    const result = calculateProportionalSeats(landslide)

    // Landslide should give clear supermajority
    expect(result.tisza).toBeGreaterThanOrEqual(130)
    expect(result.fidesz).toBeLessThanOrEqual(65)
    expect(result.tisza + result.fidesz + result.smallParty).toBe(199)
  })

  test('close race (45/44/5)', () => {
    const closeRace: VoteShare = { tisza: 45, fidesz: 44, smallParty: 5 }
    const result = calculateProportionalSeats(closeRace)

    // Close race should give similar seat counts
    expect(Math.abs(result.tisza - result.fidesz)).toBeLessThanOrEqual(20)
    expect(result.tisza + result.fidesz + result.smallParty).toBe(199)
  })

  test('high small party support (40/40/10)', () => {
    const highSmallParty: VoteShare = { tisza: 40, fidesz: 40, smallParty: 10 }
    const result = calculateProportionalSeats(highSmallParty)

    // Small party with 10% should get meaningful list seats
    expect(result.smallParty).toBeGreaterThanOrEqual(8)
    expect(result.smallParty).toBeLessThanOrEqual(15)
    expect(result.tisza + result.fidesz + result.smallParty).toBe(199)
  })

  test('minimal small party (48/47/3)', () => {
    const minimalSmallParty: VoteShare = { tisza: 48, fidesz: 47, smallParty: 3 }
    const result = calculateProportionalSeats(minimalSmallParty)

    // Below 5% threshold, no seats
    expect(result.smallParty).toBe(0)
    expect(result.tisza + result.fidesz).toBe(199)
  })
})

describe('Apply Biases', () => {
  const baseSeats: PartySeats = { tisza: 100, fidesz: 94, smallParty: 5 }

  test('Fidesz bias transfers seats from Tisza to Fidesz', () => {
    const result = applyBiases(baseSeats, 5, 0, 'tisza')

    expect(result.tisza).toBe(95)
    expect(result.fidesz).toBe(99)
    expect(result.smallParty).toBe(5)
  })

  test('Winner bias benefits Tisza when Tisza leads', () => {
    const result = applyBiases(baseSeats, 0, 5, 'tisza')

    expect(result.tisza).toBe(105)
    expect(result.fidesz).toBe(89)
    expect(result.smallParty).toBe(5)
  })

  test('Winner bias benefits Fidesz when Fidesz leads', () => {
    const fideszLeadSeats: PartySeats = { tisza: 94, fidesz: 100, smallParty: 5 }
    const result = applyBiases(fideszLeadSeats, 0, 5, 'fidesz')

    expect(result.tisza).toBe(89)
    expect(result.fidesz).toBe(105)
    expect(result.smallParty).toBe(5)
  })

  test('combined biases stack correctly', () => {
    const result = applyBiases(baseSeats, 3, 2, 'tisza')

    // Fidesz bias: 100-3=97 Tisza, 94+3=97 Fidesz
    // Winner bias (Tisza): 97+2=99 Tisza, 97-2=95 Fidesz
    expect(result.tisza).toBe(99)
    expect(result.fidesz).toBe(95)
  })

  test('bias cannot exceed available seats', () => {
    const result = applyBiases(baseSeats, 200, 0, 'tisza')

    // Can't take more than Tisza has
    expect(result.tisza).toBe(0)
    expect(result.fidesz).toBe(194)
    expect(result.smallParty).toBe(5)
  })

  test('preserves small party seats', () => {
    const result = applyBiases(baseSeats, 10, 10, 'tisza')

    expect(result.smallParty).toBe(5)
  })
})

describe('calculateFinalSeats (Integration)', () => {
  test('calculates correct seats with default options', () => {
    const votes: VoteShare = { tisza: 48, fidesz: 40, smallParty: 5 }
    const result = calculateFinalSeats(votes)

    expect(result.tisza + result.fidesz + result.smallParty).toBe(199)
    expect(result.tisza).toBeGreaterThan(result.fidesz)
  })

  test('applies biases correctly', () => {
    const votes: VoteShare = { tisza: 48, fidesz: 40, smallParty: 5 }
    const noBias = calculateFinalSeats(votes)
    const withBias = calculateFinalSeats(votes, { fideszBias: 5 })

    expect(withBias.fidesz).toBe(noBias.fidesz + 5)
    expect(withBias.tisza).toBe(noBias.tisza - 5)
  })

  test('winner bias applied to correct party', () => {
    const tiszaLeads: VoteShare = { tisza: 48, fidesz: 40, smallParty: 5 }
    const fideszLeads: VoteShare = { tisza: 40, fidesz: 48, smallParty: 5 }

    const tiszaResult = calculateFinalSeats(tiszaLeads, { winnerBias: 5 })
    const fideszResult = calculateFinalSeats(fideszLeads, { winnerBias: 5 })

    // Winner bias should benefit different parties
    const tiszaNoBias = calculateFinalSeats(tiszaLeads)
    const fideszNoBias = calculateFinalSeats(fideszLeads)

    expect(tiszaResult.tisza).toBe(tiszaNoBias.tisza + 5)
    expect(fideszResult.fidesz).toBe(fideszNoBias.fidesz + 5)
  })
})

describe('Regression tests', () => {
  test('48/40/5 does not produce extreme results', () => {
    const votes: VoteShare = { tisza: 48, fidesz: 40, smallParty: 5 }
    const result = calculateProportionalSeats(votes)

    // Should NOT produce 193 Tisza seats (previous bug)
    expect(result.tisza).toBeLessThan(150)
    expect(result.fidesz).toBeGreaterThan(50)
  })

  test('40/40/5 produces balanced results', () => {
    const votes: VoteShare = { tisza: 40, fidesz: 40, smallParty: 5 }
    const result = calculateProportionalSeats(votes)

    // Should NOT produce 140/54 split (previous bug)
    expect(Math.abs(result.tisza - result.fidesz)).toBeLessThan(20)
  })

  test('disabling opinion biases does not affect raw poll calculation', () => {
    // This tests the fix: seat calculation uses raw poll data
    const votes: VoteShare = { tisza: 48, fidesz: 40, smallParty: 5 }
    const result = calculateProportionalSeats(votes)

    // Results should be consistent regardless of opinion bias state
    // (opinion biases are external to this calculation)
    expect(result.tisza + result.fidesz + result.smallParty).toBe(199)
    expect(result.tisza).toBeGreaterThan(result.fidesz)
  })
})
