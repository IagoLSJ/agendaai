import { TimeSlot } from '@/types'

/**
 * Generate time slots in 30-minute intervals
 */
export function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = []
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  let currentMinutes = startHour * 60 + startMinute
  const endMinutes = endHour * 60 + endMinute

  while (currentMinutes < endMinutes) {
    const hours = Math.floor(currentMinutes / 60)
    const minutes = currentMinutes % 60
    slots.push(
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`
    )
    currentMinutes += intervalMinutes
  }

  return slots
}

/**
 * Check if a time slot is available
 */
export function markAvailableSlots(
  allSlots: string[],
  bookedSlots: string[],
  serviceDuration: number
): TimeSlot[] {
  return allSlots.map((slot) => {
    // Check if this slot and required duration is available
    const slotIndex = allSlots.indexOf(slot)
    const slotsNeeded = Math.ceil(serviceDuration / 30)

    let available = true

    // Check if we have enough slots ahead
    if (slotIndex + slotsNeeded > allSlots.length) {
      available = false
    } else {
      // Check if any of the required slots are booked
      for (let i = 0; i < slotsNeeded; i++) {
        if (bookedSlots.includes(allSlots[slotIndex + i])) {
          available = false
          break
        }
      }
    }

    return {
      time: slot,
      available,
    }
  })
}

/**
 * Format time for display (HH:MM)
 */
export function formatTime(time: string): string {
  return time.substring(0, 5)
}

/**
 * Format date for display
 */
/**
 * Format date for display
 */
export function formatDate(date: string): string {
  // Append T12:00:00 to ensure we're dealing with the date in the middle of the day
  // prevent timezone shifts when parsing "YYYY-MM-DD" which defaults to UTC midnight
  return new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Get day of week (1-7, Monday-Sunday)
 */
/**
 * Get day of week (1-7, Monday-Sunday)
 */
export function getDayOfWeek(date: string): number {
  const d = new Date(date)
  const day = d.getUTCDay()
  // Convert from JS (0-6, Sunday-Saturday) to our format (1-7, Monday-Sunday)
  return day === 0 ? 7 : day
}

/**
 * Get dates for the next N days
 */
export function getNextDays(days: number): string[] {
  const dates: string[] = []
  const today = new Date()

  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    // Create date string manually to avoid UTC conversion issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    dates.push(`${year}-${month}-${day}`)
  }

  return dates
}

/**
 * Format WhatsApp number (remove non-digits, keep only numbers)
 */
export function formatWhatsApp(phone: string): string {
  return phone.replace(/\D/g, '')
}

/**
 * Validate WhatsApp number
 */
export function isValidWhatsApp(phone: string): boolean {
  const cleaned = formatWhatsApp(phone)
  return cleaned.length >= 10 && cleaned.length <= 15
}
