# Project Architecture

This document explains the technical architecture and design decisions of the Appointment Scheduler application.

## Overview

The application follows a modern, scalable architecture using Next.js App Router with a clear separation of concerns.

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│  Next.js 14 (App Router) + React + TypeScript   │
│              Tailwind CSS                        │
└────────────────┬────────────────────────────────┘
                 │
                 │ HTTP/HTTPS
                 │
┌────────────────▼────────────────────────────────┐
│              Supabase Backend                    │
│  ┌──────────────────────────────────────────┐  │
│  │         PostgreSQL Database              │  │
│  │  (Row Level Security enabled)            │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │         Authentication Service           │  │
│  │  (Email/Password, Magic Links)           │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │         Realtime Subscriptions           │  │
│  │  (Optional for future features)          │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Layer Architecture

### 1. Presentation Layer (Components)

**Location**: `/components/`

**Responsibility**: UI rendering and user interaction

**Components**:
- **Server Components** (default): Fetch data, no client-side JS
- **Client Components** ('use client'): Interactive forms, state management

**Example**:
```typescript
// Server Component
async function AppointmentsList() {
  const appointments = await getAppointments()
  return <div>...</div>
}

// Client Component
'use client'
function BookingForm() {
  const [state, setState] = useState()
  return <form>...</form>
}
```

### 2. Service Layer

**Location**: `/services/`

**Responsibility**: Data access and business logic

**Files**:
- `appointments.ts` - Appointment CRUD and availability
- `services.ts` - Service management
- `business-hours.ts` - Operating hours management
- `users.ts` - User profile management

**Why Separate?**
- Single source of truth for data operations
- Easier testing and maintenance
- Can be reused across different components

**Example**:
```typescript
export async function getAvailableTimeSlots(
  userId: string,
  serviceId: string,
  date: string
): Promise<TimeSlot[]> {
  // Complex logic to calculate availability
  // Separated from UI concerns
}
```

### 3. Data Layer (Supabase)

**Location**: `/lib/supabase/`

**Files**:
- `client.ts` - Browser client (client components)
- `server.ts` - Server client (server components)

**Two Client Pattern**:
```typescript
// In client components
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// In server components
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()
```

### 4. Utility Layer

**Location**: `/lib/utils/`

**Responsibility**: Pure functions, no side effects

**Example**:
```typescript
// scheduling.ts
export function generateTimeSlots(
  startTime: string,
  endTime: string
): string[] {
  // Pure function - same input always gives same output
}
```

## Data Flow

### 1. Public Booking Flow

```
User visits /:slug
    ↓
[Server Component] Fetch user, services
    ↓
[Client Component] User selects options
    ↓
[Service Layer] Check availability
    ↓
[Database] Insert appointment (RLS check)
    ↓
Confirmation shown
```

### 2. Admin Dashboard Flow

```
User visits /dashboard
    ↓
[Middleware] Check authentication
    ↓
[Server Component] Fetch user data
    ↓
[Client Component] User makes changes
    ↓
[Server Action] Update database
    ↓
[Revalidation] Refresh UI
```

## Security Architecture

### Row Level Security (RLS)

Every table has RLS policies that enforce:

1. **Users can only see their own data**
   ```sql
   CREATE POLICY "Users can view own services" ON services
     FOR SELECT USING (auth.uid() = user_id);
   ```

2. **Public users can view but not modify**
   ```sql
   CREATE POLICY "Public can view services" ON services
     FOR SELECT USING (true);
   ```

3. **Prevent double booking**
   ```sql
   CREATE UNIQUE INDEX idx_appointments_unique_slot 
     ON appointments(user_id, date, start_time) 
     WHERE status != 'cancelled';
   ```

### Authentication Flow

```
User submits credentials
    ↓
Supabase Auth validates
    ↓
JWT token set in cookie
    ↓
Middleware checks token on protected routes
    ↓
Server components access auth.uid()
    ↓
RLS policies enforce data access
```

## Routing Architecture

### App Router Structure

```
app/
├── page.tsx                 # Home page
├── login/page.tsx           # Auth page
├── dashboard/
│   ├── layout.tsx           # Dashboard layout
│   ├── appointments/page.tsx
│   ├── services/page.tsx
│   └── hours/page.tsx
└── [slug]/page.tsx          # Dynamic booking page
```

### Dynamic Routes

**Pattern**: `app/[slug]/page.tsx`

**How it works**:
1. User visits `/my-salon`
2. Next.js matches `[slug]` route
3. `params.slug` = "my-salon"
4. Query database for user with slug
5. Render booking page

## State Management

### Server State (Recommended)

```typescript
// Data fetching in Server Components
async function Page() {
  const data = await fetchData()
  return <Component data={data} />
}
```

**Benefits**:
- No client-side state management needed
- Automatic data fetching
- Better performance

### Client State (When Needed)

```typescript
'use client'

function BookingFlow() {
  const [step, setStep] = useState('service')
  const [booking, setBooking] = useState({})
  
  // Step-by-step wizard state
}
```

**Use Cases**:
- Multi-step forms
- Interactive UI
- Temporary state

## Database Design Decisions

### Why UUID Primary Keys?

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
);
```

**Advantages**:
- Not sequential (harder to enumerate)
- Can be generated client-side if needed
- Better for distributed systems

### Why Separate business_hours Table?

```sql
CREATE TABLE business_hours (
  day_of_week INTEGER,
  start_time TIME,
  end_time TIME
);
```

**Alternatives considered**:
- JSONB column in users table
- Separate row per hour

**Chosen approach**:
- Easy to query specific days
- Supports validation
- Can add exceptions/holidays later

### Time Slot Strategy

**30-minute intervals**:
- Balance between flexibility and simplicity
- Most services fit 30/60/90 minutes
- Easy to calculate and display

**Double booking prevention**:
```sql
CREATE UNIQUE INDEX idx_appointments_unique_slot 
  ON appointments(user_id, date, start_time) 
  WHERE status != 'cancelled';
```

## Performance Optimizations

### 1. Database Indexes

```sql
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(date);
```

**Why**: Speed up common queries

### 2. Server Components Default

```typescript
// Default - no 'use client'
async function Page() {
  // Rendered on server, no JS sent to client
}
```

**Why**: Faster page loads, better SEO

### 3. Selective Client Components

```typescript
'use client' // Only when needed
function InteractiveForm() {
  // Interactive features
}
```

**Why**: Minimize JavaScript bundle size

## Scalability Considerations

### Multi-Tenant Architecture

**Current Implementation**: Single database, RLS for isolation

```sql
-- Each user's data is isolated via RLS
CREATE POLICY "Users can view own data" ON table_name
  FOR SELECT USING (auth.uid() = user_id);
```

**Supports**:
- Unlimited businesses on same database
- Automatic data isolation
- Cost-effective scaling

### Potential Bottlenecks

1. **Time slot calculation**
   - Current: Calculate on-demand
   - Future: Pre-calculate and cache

2. **Database connections**
   - Current: Connection pooling via Supabase
   - Future: Add caching layer (Redis)

## Type Safety

### Database Types

```typescript
// types/database.types.ts
export interface Database {
  public: {
    Tables: {
      users: { /* ... */ }
      services: { /* ... */ }
    }
  }
}
```

### Generated from Schema

```typescript
// Ensures TypeScript matches database
type User = Database['public']['Tables']['users']['Row']
```

**Benefits**:
- Compile-time error checking
- Autocomplete in IDE
- Refactoring safety

## Testing Strategy

### What to Test

1. **Database Layer**
   - RLS policies work correctly
   - Queries return expected data
   - Constraints prevent bad data

2. **Service Layer**
   - Time slot calculation
   - Availability logic
   - Business rules

3. **Components**
   - User interactions
   - Form validation
   - Error handling

### Recommended Tools

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "vitest": "^1.0.0",
    "playwright": "^1.40.0"
  }
}
```

## Error Handling

### Database Errors

```typescript
try {
  await createAppointment(data)
} catch (error) {
  if (error.code === '23505') {
    // Unique constraint violation
    throw new Error('Time slot already booked')
  }
  throw error
}
```

### Form Validation

```typescript
// Client-side validation
if (!isValidWhatsApp(phone)) {
  setError('Invalid phone number')
  return
}

// Server-side validation (always!)
const validated = schema.parse(data)
```

## Future Architecture Improvements

### 1. Caching Layer

```
Browser → Next.js → Redis Cache → Supabase
                      ↓
                 Cache Hit: Return
                 Cache Miss: Query DB
```

### 2. Event System

```typescript
// When appointment created
await createAppointment(data)
await eventBus.emit('appointment.created', data)

// Handlers
eventBus.on('appointment.created', sendWhatsAppNotification)
eventBus.on('appointment.created', sendEmailConfirmation)
```

### 3. Background Jobs

```typescript
// Current: Synchronous
await sendNotification()

// Future: Queue
await queue.add('send-notification', data)
```

## Monitoring and Observability

### Recommended Tools

1. **Application Monitoring**: Vercel Analytics
2. **Database Monitoring**: Supabase Dashboard
3. **Error Tracking**: Sentry
4. **Logging**: Structured logging with context

### Key Metrics

- Response time
- Error rate
- Database query performance
- User flow completion rate

---

This architecture provides a solid foundation for a production appointment scheduling system while remaining simple enough to understand and maintain.
