/**
 * Validation test: 2022 Hungarian Election - New Model
 *
 * Expected behavior:
 * 1. All biases OFF → ~Proportional (54/35/6% → ~107/70/12 seats)
 * 2. Electoral system (1989) ON → Winner advantage (~125/65/9)
 * 3. ALL biases ON → Matches 2022 reality (135/57/6)
 */

import { calculateProportionalSeats, dHondtAllocate, TOTAL_SEATS } from './seat-calculation'

describe('2022 Validation - New Model', () => {
  // 2022 actual vote shares
  const votes2022 = {
    tisza: 35,     // Opposition
    fidesz: 54,    // Fidesz
    smallParty: 6  // Mi Hazánk
  }

  const actual2022 = {
    fidesz: 135,
    opposition: 57,
    miHazank: 6
  }

  test('Scenario 1: ALL biases OFF → Near proportional', () => {
    // Pure D'Hondt proportional for all 199 seats
    const proportionalSeats = dHondtAllocate(votes2022, TOTAL_SEATS, true)

    console.log('\n=== ALL BIASES OFF (Pure Proportional) ===')
    console.log(`Fidesz: ${proportionalSeats.fidesz} (vote: 54%)`)
    console.log(`Opposition: ${proportionalSeats.tisza} (vote: 35%)`)
    console.log(`Mi Hazánk: ${proportionalSeats.smallParty} (vote: 6%)`)

    // Should be roughly proportional to vote share
    // 54% of 199 ≈ 107, 35% of 199 ≈ 70, 6% of 199 ≈ 12
    expect(proportionalSeats.fidesz).toBeGreaterThanOrEqual(105)
    expect(proportionalSeats.fidesz).toBeLessThanOrEqual(115)
    expect(proportionalSeats.tisza).toBeGreaterThanOrEqual(65)
    expect(proportionalSeats.tisza).toBeLessThanOrEqual(75)
  })

  test('Scenario 2: Electoral system bias (1989) ON → Winner advantage', () => {
    // With electoral system bias = 0.15 (typical mixed system effect)
    const seats = calculateProportionalSeats(votes2022, 0.01, 0.15)

    console.log('\n=== ELECTORAL SYSTEM (1989) BIAS ON ===')
    console.log(`Fidesz: ${seats.fidesz}`)
    console.log(`Opposition: ${seats.tisza}`)
    console.log(`Mi Hazánk: ${seats.smallParty}`)

    // Winner should have advantage, but not as extreme as full biases
    expect(seats.fidesz).toBeGreaterThan(110)
    expect(seats.fidesz).toBeLessThan(140)
  })

  test('Scenario 3: ALL biases ON → Match 2022 reality', () => {
    // Electoral system bias + additional seat biases should get us to reality
    // 2022 preset values: electoralWeighting=15 (0.15 bias)
    const baseSeats = calculateProportionalSeats(votes2022, 0.01, 0.15)

    console.log('\n=== FULL BIAS (should match 2022) ===')
    console.log(`Base with electoral bias 0.15: Fidesz=${baseSeats.fidesz}, Opp=${baseSeats.tisza}`)

    // 2022 preset seat biases:
    // gerrymandering: 5, minority MP: 1 → fideszBias = 6
    // winner comp: 2, parliament size: 1 → winnerBias = 3
    const additionalFideszBias = 5 + 1  // gerrymandering + minority MP
    const additionalWinnerBias = 2 + 1  // winner comp + parliament size

    const finalFidesz = Math.min(199, baseSeats.fidesz + additionalFideszBias + additionalWinnerBias)
    const finalOpp = Math.max(0, baseSeats.tisza - additionalFideszBias - additionalWinnerBias)

    console.log(`With seat biases (+${additionalFideszBias + additionalWinnerBias}): Fidesz=${finalFidesz}, Opp=${finalOpp}`)
    console.log(`Actual 2022: Fidesz=${actual2022.fidesz}, Opp=${actual2022.opposition}`)

    const error = Math.abs(finalFidesz - actual2022.fidesz) + Math.abs(finalOpp - actual2022.opposition)
    console.log(`Error: ${error} seats`)

    // Should be within 5 seats of reality with correct bias values
    expect(error).toBeLessThanOrEqual(5)
  })

  test('Find optimal electoral system bias value', () => {
    console.log('\n=== Finding optimal bias value ===')

    for (let bias = 0; bias <= 0.3; bias += 0.05) {
      const seats = calculateProportionalSeats(votes2022, 0.01, bias)
      console.log(`Bias ${bias.toFixed(2)}: Fidesz=${seats.fidesz}, Opp=${seats.tisza}, Mi Hazánk=${seats.smallParty}`)
    }
  })
})
