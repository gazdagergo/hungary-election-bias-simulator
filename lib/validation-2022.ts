/**
 * Validation test: 2022 Hungarian Election
 *
 * Actual Results:
 * - Fidesz: 54.13% → 135 seats (87 SMD + 48 list)
 * - Opposition: 34.46% → 57 seats (19 SMD + 38 list)
 * - Mi Hazánk: 6.17% → 6 seats (0 SMD + 6 list)
 */

import { calculateProportionalSeats, calculateSmdSeats, dHondtAllocate, LIST_SEATS } from './seat-calculation'

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

console.log("=== 2022 Hungarian Election Model Validation ===\n")
console.log("Input (actual vote shares):")
console.log("  Fidesz: " + votes2022.fidesz + "%")
console.log("  Opposition: " + votes2022.tisza + "%")
console.log("  Mi Hazánk: " + votes2022.smallParty + "%")
console.log()

// Calculate SMD seats
const smdSeats = calculateSmdSeats(votes2022, 0.01)
console.log("SMD Seats (model prediction):")
console.log("  Fidesz: " + smdSeats.fidesz + " (actual: " + actual2022.fidesz.smd + ")")
console.log("  Opposition: " + smdSeats.tisza + " (actual: " + actual2022.opposition.smd + ")")
console.log()

// Calculate list seats
const listSeats = dHondtAllocate(votes2022, LIST_SEATS, true)
console.log("List Seats (model prediction):")
console.log("  Fidesz: " + listSeats.fidesz + " (actual: " + actual2022.fidesz.list + ")")
console.log("  Opposition: " + listSeats.tisza + " (actual: " + actual2022.opposition.list + ")")
console.log("  Mi Hazánk: " + listSeats.smallParty + " (actual: " + actual2022.miHazank.list + ")")
console.log()

// Total seats
const totalSeats = calculateProportionalSeats(votes2022, 0.01)
console.log("Total Seats (model prediction):")
console.log("  Fidesz: " + totalSeats.fidesz + " (actual: " + actual2022.fidesz.total + ")")
console.log("  Opposition: " + totalSeats.tisza + " (actual: " + actual2022.opposition.total + ")")
console.log("  Mi Hazánk: " + totalSeats.smallParty + " (actual: " + actual2022.miHazank.total + ")")
console.log()

// Calculate differences
const fideszDiff = totalSeats.fidesz - actual2022.fidesz.total
const oppDiff = totalSeats.tisza - actual2022.opposition.total
const miHazankDiff = totalSeats.smallParty - actual2022.miHazank.total

console.log("Difference (model - actual):")
console.log("  Fidesz: " + (fideszDiff > 0 ? "+" : "") + fideszDiff + " seats")
console.log("  Opposition: " + (oppDiff > 0 ? "+" : "") + oppDiff + " seats")
console.log("  Mi Hazánk: " + (miHazankDiff > 0 ? "+" : "") + miHazankDiff + " seats")
console.log()

// Verdict
const totalError = Math.abs(fideszDiff) + Math.abs(oppDiff) + Math.abs(miHazankDiff)
console.log("Total absolute error: " + totalError + " seats")
if (totalError <= 10) {
  console.log("✓ Model produces realistic results (within 10 seats)")
} else if (totalError <= 20) {
  console.log("~ Model produces reasonable results (within 20 seats)")
} else {
  console.log("✗ Model has significant deviation from actual results")
}
