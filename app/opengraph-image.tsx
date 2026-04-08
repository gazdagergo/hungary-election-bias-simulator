import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'lejtapalya.hu - A magyar választási rendszer torzításai'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  // Simplified horseshoe parliament seats
  const seats: { x: number; y: number; color: string }[] = []

  // Generate horseshoe pattern
  const centerX = 600
  const centerY = 420
  const rows = 8
  const seatsPerRow = [20, 22, 24, 26, 28, 30, 32, 34]

  let seatIndex = 0
  const totalSeats = 199
  const tiszaSeats = 95 // Example: slight Tisza lead
  const fideszSeats = 99
  const smallPartySeats = 5

  for (let row = 0; row < rows; row++) {
    const radius = 120 + row * 28
    const numSeats = seatsPerRow[row]

    for (let i = 0; i < numSeats; i++) {
      const angle = Math.PI + (Math.PI * (i + 0.5)) / numSeats
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      // Determine color based on seat index
      let color: string
      if (seatIndex < fideszSeats) {
        color = '#f97316' // Fidesz orange
      } else if (seatIndex < fideszSeats + smallPartySeats) {
        color = '#6b7280' // Small party gray
      } else {
        color = '#3b82f6' // Tisza blue
      }

      seats.push({ x, y, color })
      seatIndex++
      if (seatIndex >= totalSeats) break
    }
    if (seatIndex >= totalSeats) break
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0c1117 0%, #1a1f2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top gradient bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #3b82f6 0%, #f97316 50%, #3b82f6 100%)',
          }}
        />

        {/* Parliament horseshoe */}
        <div
          style={{
            position: 'relative',
            width: 1200,
            height: 350,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {seats.map((seat, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: seat.x,
                top: seat.y - 200,
                width: 14,
                height: 14,
                borderRadius: 3,
                backgroundColor: seat.color,
                transform: 'translateX(-50%)',
              }}
            />
          ))}
        </div>

        {/* Logo and title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: -60,
          }}
        >
          {/* Tilted building icon (simplified) */}
          <div
            style={{
              fontSize: 48,
              marginBottom: 16,
              transform: 'rotate(-12deg)',
              color: '#f97316',
            }}
          >
            🏛️
          </div>

          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.02em',
            }}
          >
            lejtapalya.hu
          </div>

          <div
            style={{
              fontSize: 24,
              color: '#9ca3af',
              marginTop: 12,
            }}
          >
            A magyar választási rendszer torzításai
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
