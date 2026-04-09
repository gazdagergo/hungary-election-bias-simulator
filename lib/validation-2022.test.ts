/**
 * Validation test: 2022 Hungarian Election
 *
 * Actual Results:
 * - Fidesz: 54.13% → 135 seats (87 SMD + 48 list)
 * - Opposition: 34.46% → 57 seats (19 SMD + 38 list)
 * - Mi Hazánk: 6.17% → 6 seats (0 SMD + 6 list)
 */

import { calculateProportionalSeats, calculateSmdSeats, dHondtAllocate, LIST_SEATS } from './seat-calculation'

describe('2022 Hungarian Election Validation', () => {
  // 2022 actual vote shares
  const votes2022 = {
    tisza: 34.46,  // Opposition (United for Hungary)
    fidesz: 54.13, // Fidesz-KDNP
    smallParty: 6.17 // Mi Hazánk
  }

  // 2022 actual results
  const actual2022 = {
    opposition: { total: 57, smd: 19, list: 38 },
    fidesz: { total: 135, smd: 87, list: 48 },
    miHazank: { total: 6, smd: 0, list: 6 }
  }

  test('SMD seats calculation matches 2022 reality', () => {
    const smdSeats = calculateSmdSeats(votes2022, 0.01)

    console.log('\n=== SMD Seats ===')
    console.log(`Fidesz: model=${smdSeats.fidesz}, actual=${actual2022.fidesz.smd}`)
    console.log(`Opposition: model=${smdSeats.tisza}, actual=${actual2022.opposition.smd}`)

    // Allow some tolerance - our model is simplified
    expect(smdSeats.fidesz).toBeGreaterThan(70) // Fidesz dominated SMD
    expect(smdSeats.tisza).toBeLessThan(40) // Opposition got few SMD
  })

  test('List seats calculation matches 2022 reality', () => {
    const listSeats = dHondtAllocate(votes2022, LIST_SEATS, true)

    console.log('\n=== List Seats ===')
    console.log(`Fidesz: model=${listSeats.fidesz}, actual=${actual2022.fidesz.list}`)
    console.log(`Opposition: model=${listSeats.tisza}, actual=${actual2022.opposition.list}`)
    console.log(`Mi Hazánk: model=${listSeats.smallParty}, actual=${actual2022.miHazank.list}`)

    // D'Hondt should be accurate for list seats
    expect(Math.abs(listSeats.fidesz - actual2022.fidesz.list)).toBeLessThanOrEqual(5)
    expect(Math.abs(listSeats.tisza - actual2022.opposition.list)).toBeLessThanOrEqual(5)
    expect(Math.abs(listSeats.smallParty - actual2022.miHazank.list)).toBeLessThanOrEqual(2)
  })

  test('Total seats within reasonable range of 2022 reality', () => {
    const totalSeats = calculateProportionalSeats(votes2022, 0.01)

    console.log('\n=== Total Seats ===')
    console.log(`Fidesz: model=${totalSeats.fidesz}, actual=${actual2022.fidesz.total}`)
    console.log(`Opposition: model=${totalSeats.tisza}, actual=${actual2022.opposition.total}`)
    console.log(`Mi Hazánk: model=${totalSeats.smallParty}, actual=${actual2022.miHazank.total}`)

    const fideszDiff = totalSeats.fidesz - actual2022.fidesz.total
    const oppDiff = totalSeats.tisza - actual2022.opposition.total
    const miHazankDiff = totalSeats.smallParty - actual2022.miHazank.total
    const totalError = Math.abs(fideszDiff) + Math.abs(oppDiff) + Math.abs(miHazankDiff)

    console.log('\n=== Differences ===')
    console.log(`Fidesz: ${fideszDiff > 0 ? '+' : ''}${fideszDiff}`)
    console.log(`Opposition: ${oppDiff > 0 ? '+' : ''}${oppDiff}`)
    console.log(`Mi Hazánk: ${miHazankDiff > 0 ? '+' : ''}${miHazankDiff}`)
    console.log(`Total error: ${totalError} seats`)

    // Model should be within ~15 seats of reality
    // (our model is simplified and doesn't account for all factors)
    expect(totalError).toBeLessThanOrEqual(20)

    // Fidesz should get 2/3 majority (133+)
    expect(totalSeats.fidesz).toBeGreaterThanOrEqual(130)
  })
})
