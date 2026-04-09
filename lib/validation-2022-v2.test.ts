/**
 * Validation test: 2022 Hungarian Election
 * Testing with seat-conversion biases only (opinion biases disabled)
 */

import { calculateProportionalSeats, applyBiases } from './seat-calculation'

describe('2022 Validation - Seat biases only', () => {
  // 2022 actual vote shares (already includes opinion bias effects)
  const votes2022 = {
    tisza: 35,     // Opposition
    fidesz: 54,    // Fidesz
    smallParty: 6  // Mi Hazánk
  }

  const actual2022 = {
    opposition: 57,
    fidesz: 135,
    miHazank: 6
  }

  test('With NO biases at all', () => {
    const seats = calculateProportionalSeats(votes2022, 0.01)
    console.log('\n=== No biases ===')
    console.log(`Fidesz: ${seats.fidesz} (actual: ${actual2022.fidesz})`)
    console.log(`Opposition: ${seats.tisza} (actual: ${actual2022.opposition})`)
    console.log(`Mi Hazánk: ${seats.smallParty} (actual: ${actual2022.miHazank})`)
  })

  test('With default seat-conversion biases', () => {
    // Default seat-conversion biases from the app:
    // - gerrymandering: 6 (Fidesz)
    // - minority-mp: 1 (Fidesz)
    // - winner-compensation: 5 (winner = Fidesz)
    // - parliament-size: 3 (winner = Fidesz)
    // - electoral-weighting: 3 (winner = Fidesz)

    const baseSeats = calculateProportionalSeats(votes2022, 0.01)

    // Fidesz-specific biases
    const fideszBias = 6 + 1  // gerrymandering + minority MP
    // Winner biases (Fidesz is winner)
    const winnerBias = 5 + 3 + 3  // winner-comp + parliament-size + electoral-weighting

    const finalSeats = applyBiases(baseSeats, fideszBias, winnerBias, 'fidesz')

    console.log('\n=== With seat-conversion biases ===')
    console.log(`Base: Fidesz=${baseSeats.fidesz}, Opp=${baseSeats.tisza}`)
    console.log(`Fidesz bias: +${fideszBias}, Winner bias: +${winnerBias}`)
    console.log(`Final: Fidesz=${finalSeats.fidesz}, Opp=${finalSeats.tisza}, Mi Hazánk=${finalSeats.smallParty}`)
    console.log(`Actual: Fidesz=${actual2022.fidesz}, Opp=${actual2022.opposition}, Mi Hazánk=${actual2022.miHazank}`)

    const error = Math.abs(finalSeats.fidesz - actual2022.fidesz) +
                  Math.abs(finalSeats.tisza - actual2022.opposition)
    console.log(`Error: ${error} seats`)
  })

  test('Finding best-fit biases', () => {
    const baseSeats = calculateProportionalSeats(votes2022, 0.01)
    console.log('\n=== Base calculation (SMD + D\'Hondt only) ===')
    console.log(`Fidesz: ${baseSeats.fidesz}`)
    console.log(`Opposition: ${baseSeats.tisza}`)

    // To get from base to actual, how much bias is needed?
    const neededFideszBoost = actual2022.fidesz - baseSeats.fidesz
    console.log(`\nTo match 2022 reality, Fidesz needs: ${neededFideszBoost} additional seats`)
  })
})
