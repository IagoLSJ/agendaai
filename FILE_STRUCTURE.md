# Project File Structure

Complete reference of all files and their purposes.

## Root Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.ts` | Tailwind CSS customization |
| `postcss.config.js` | PostCSS plugins |
| `next.config.js` | Next.js configuration |
| `.env.example` | Environment variables template |
| `.gitignore` | Git ignore rules |
| `middleware.ts` | Route protection and auth |
| `README.md` | Project documentation |
| `QUICKSTART.md` | 10-minute setup guide |
| `DEPLOYMENT.md` | Production deployment guide |
| `ARCHITECTURE.md` | Technical architecture docs |

## `/app` - Application Routes

### Root Level
- `app/layout.tsx` - Root layout with global styles
- `app/page.tsx` - Home page
- `app/globals.css` - Global CSS and Tailwind

### Authentication
- `app/login/page.tsx` - Login/signup page (client component)

### Dashboard (Protected)
- `app/dashboard/layout.tsx` - Dashboard layout with nav
- `app/dashboard/appointments/page.tsx` - View appointments
- `app/dashboard/services/page.tsx` - Manage services
- `app/dashboard/hours/page.tsx` - Set business hours

### Public Booking
- `app/[slug]/page.tsx` - Public booking page (dynamic route)

## `/components` - React Components

### Dashboard Components
- `LogoutButton.tsx` - Sign out button (client)
- `AppointmentActions.tsx` - Complete/cancel buttons (client)
- `ServiceForm.tsx` - Add service form (client)
- `ServiceList.tsx` - Display services (client)
- `BusinessHoursForm.tsx` - Set hours form (client)

### Booking Flow Components
- `BookingFlow.tsx` - Main wizard coordinator (client)
- `booking/ServiceSelection.tsx` - Step 1: Choose service
- `booking/DateSelection.tsx` - Step 2: Pick date (client)
- `booking/TimeSelection.tsx` - Step 3: Select time (client)
- `booking/ClientInfoForm.tsx` - Step 4: Enter info (client)
- `booking/ConfirmationScreen.tsx` - Step 5: Success message

## `/lib` - Utility Libraries

### Supabase Clients
- `lib/supabase/client.ts` - Browser client (client components)
- `lib/supabase/server.ts` - Server client (server components)

### Utilities
- `lib/utils/scheduling.ts` - Time slot generation, formatting

## `/services` - Data Access Layer

| File | Purpose |
|------|---------|
| `appointments.ts` | Appointment CRUD and availability |
| `services.ts` | Service management |
| `business-hours.ts` | Operating hours management |
| `users.ts` | User profile access |

**Key Functions:**

**appointments.ts**
- `getAppointmentsByUser()` - Fetch user's appointments
- `getAvailableTimeSlots()` - Calculate available times
- `createAppointment()` - Book appointment with validation
- `updateAppointmentStatus()` - Change status
- `deleteAppointment()` - Remove appointment

**services.ts**
- `getServicesByUser()` - Get user's services
- `getServicesBySlug()` - Get public services
- `createService()` - Add new service
- `updateService()` - Edit service
- `deleteService()` - Remove service

**business-hours.ts**
- `getBusinessHoursByUser()` - Get user's hours
- `getBusinessHoursBySlug()` - Get public hours
- `upsertBusinessHours()` - Save hours
- `deleteBusinessHour()` - Remove day

**users.ts**
- `getCurrentUser()` - Get logged-in user
- `getUserBySlug()` - Get user by slug
- `updateUser()` - Edit profile

## `/types` - TypeScript Definitions

- `types/database.types.ts` - Generated from Supabase schema
- `types/index.ts` - Application types and constants

**Key Types:**
```typescript
type User - User profile
type Service - Service definition
type BusinessHour - Operating hours
type Appointment - Appointment record
type TimeSlot - Available time slot
type BookingFormData - Booking form data
```

## `/supabase` - Database

### Migrations
- `supabase/migrations/20240101000000_initial_schema.sql`
  - Creates all tables
  - Sets up RLS policies
  - Adds indexes
  - Creates triggers
  - Configures auth

## Component Patterns

### Server Component (Default)
```typescript
// No 'use client' directive
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

**Use for:**
- Data fetching
- Initial page render
- SEO-friendly content

### Client Component
```typescript
'use client'

export default function Form() {
  const [state, setState] = useState()
  return <form>...</form>
}
```

**Use for:**
- Forms and input
- Interactive UI
- State management
- Browser APIs

## Data Flow Patterns

### 1. Server Component → Service → Database
```typescript
async function Page() {
  const appointments = await getAppointments() // Service layer
  return <List data={appointments} />
}
```

### 2. Client Component → Service → Database
```typescript
'use client'

function Form() {
  const handleSubmit = async () => {
    await createService(data) // Service layer
    router.refresh() // Trigger re-render
  }
}
```

### 3. Public Access (No Auth)
```typescript
async function BookingPage({ params }) {
  const services = await getServicesBySlug(params.slug)
  return <BookingFlow services={services} />
}
```

## Styling Approach

### Tailwind Utility Classes
```tsx
<button className="px-6 py-3 bg-primary-600 text-white rounded-lg">
  Click Me
</button>
```

### Custom CSS Classes (globals.css)
```css
.btn {
  @apply px-6 py-3 rounded-lg font-medium;
}
```

### Usage
```tsx
<button className="btn btn-primary">
  Click Me
</button>
```

## Environment Variables

### Required
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Note on NEXT_PUBLIC_
Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.
Never put secrets in NEXT_PUBLIC_ variables.

## Database Schema Summary

```
users (business owners)
  ↓ one-to-many
services (haircut, massage, etc.)
  
users
  ↓ one-to-many
business_hours (Mon 9-5, Tue 9-5, etc.)

users + services
  ↓ one-to-many
appointments (bookings)
```

## Key Features Implementation

### 1. Double Booking Prevention
**Where**: Database unique index
**File**: `supabase/migrations/...sql`
```sql
CREATE UNIQUE INDEX idx_appointments_unique_slot 
  ON appointments(user_id, date, start_time);
```

### 2. Time Slot Generation
**Where**: Utility function
**File**: `lib/utils/scheduling.ts`
```typescript
function generateTimeSlots(start, end): string[]
```

### 3. Availability Check
**Where**: Service layer
**File**: `services/appointments.ts`
```typescript
async function getAvailableTimeSlots(): TimeSlot[]
```

### 4. Row Level Security
**Where**: Database policies
**File**: `supabase/migrations/...sql`
```sql
CREATE POLICY "Users can view own data"
  ON table_name FOR SELECT 
  USING (auth.uid() = user_id);
```

## Authentication Flow

1. User signs up → Trigger creates user profile
2. JWT token stored in cookie
3. Middleware validates token on protected routes
4. Server components access `auth.uid()`
5. RLS policies enforce data access

## Build & Deployment Files

### Development
```bash
npm run dev      # Uses: next dev
npm run build    # Uses: next build
npm run start    # Uses: next start
```

### Production (Vercel)
- Reads: `next.config.js`
- Uses: Environment variables from Vercel dashboard
- Outputs: `.next/` directory

## Testing Recommendations

### Unit Tests
- **Services**: Test business logic
- **Utils**: Test pure functions
- **Components**: Test rendering

### Integration Tests
- **Booking flow**: End-to-end user journey
- **Auth flow**: Login → Dashboard
- **RLS**: Permission checks

### Files to Create
```
__tests__/
  services/
    appointments.test.ts
  utils/
    scheduling.test.ts
  components/
    BookingFlow.test.tsx
```

## Maintenance Checklist

### Weekly
- [ ] Check Supabase database size
- [ ] Review error logs
- [ ] Monitor appointment volume

### Monthly
- [ ] Review and optimize slow queries
- [ ] Update dependencies
- [ ] Check for security updates

### Quarterly
- [ ] Database backup verification
- [ ] Performance audit
- [ ] User feedback review

---

This structure provides a solid foundation that's:
- ✅ Production-ready
- ✅ Type-safe
- ✅ Scalable
- ✅ Maintainable
- ✅ Well-documented
