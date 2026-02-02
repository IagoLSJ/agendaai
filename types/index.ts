import { Database } from './database.types'

export type User = Database['public']['Tables']['users']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type BusinessHour = Database['public']['Tables']['business_hours']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']

export type ServiceInsert = Database['public']['Tables']['services']['Insert']
export type BusinessHourInsert = Database['public']['Tables']['business_hours']['Insert']
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert']

export interface TimeSlot {
  time: string
  available: boolean
}

export interface BookingFormData {
  serviceId: string
  date: string
  startTime: string
  clientName: string
  clientWhatsapp: string
}

export const DAYS_OF_WEEK = [
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
  { value: 7, label: 'Domingo' }, 
]
