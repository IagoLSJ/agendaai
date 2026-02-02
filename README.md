# Appointment Scheduler

A modern, mobile-first appointment scheduling web application built for small businesses (barbershops, beauty salons, aesthetics clinics).

## 🚀 Features

### Business Owner
- ✅ Create, edit, and delete services
- ✅ Define business hours per day of week
- ✅ View upcoming appointments
- ✅ Update appointment status (complete/cancel)
- ✅ Secure authentication

### Client
- ✅ Access public booking page via business slug
- ✅ Select service and date
- ✅ View available time slots
- ✅ Enter contact information
- ✅ Receive appointment confirmation
- ✅ No authentication required

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Row Level Security)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))
- Vercel account ([vercel.com](https://vercel.com)) (optional)

## 🏗️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd appointment-scheduler
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration file:
   - Copy contents from `supabase/migrations/20240101000000_initial_schema.sql`
   - Execute the SQL

3. Get your Supabase credentials:
   - Go to **Settings** → **API**
   - Copy `Project URL` and `anon public` key

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Database Schema

### Tables

**users**
- `id` (uuid, primary key)
- `name` (text)
- `business_name` (text)
- `slug` (text, unique) - URL-friendly business identifier

**services**
- `id` (uuid, primary key)
- `name` (text)
- `duration` (integer) - in minutes
- `user_id` (uuid, foreign key)

**business_hours**
- `id` (uuid, primary key)
- `day_of_week` (integer) - 1-7 (Monday-Sunday)
- `start_time` (time)
- `end_time` (time)
- `user_id` (uuid, foreign key)

**appointments**
- `id` (uuid, primary key)
- `service_id` (uuid, foreign key)
- `date` (date)
- `start_time` (time)
- `client_name` (text)
- `client_whatsapp` (text)
- `status` (text) - confirmed, cancelled, completed
- `user_id` (uuid, foreign key)

### Security (RLS Policies)

- ✅ Users can only manage their own data
- ✅ Public users can view services and create appointments
- ✅ Appointments cannot be read by public users
- ✅ Double booking prevention via unique constraint

## 🗺️ Routes

### Authentication
- `/login` - Business owner login/signup

### Admin (Protected)
- `/dashboard/appointments` - View and manage appointments
- `/dashboard/services` - Manage services
- `/dashboard/hours` - Set business hours

### Public
- `/:slug` - Public booking page for clients

## 🎨 Key Components

### Booking Flow
1. **Service Selection** - Choose from available services
2. **Date Selection** - Pick an available date
3. **Time Selection** - Select from available 30-minute slots
4. **Client Information** - Enter name and WhatsApp
5. **Confirmation** - Receive booking confirmation

### Scheduling Logic
- Time slots generated in 30-minute intervals
- Slots filtered by business hours
- Existing bookings excluded
- Service duration considered for availability
- Backend validation prevents double booking

## 🚀 Deployment to Vercel

### Option 1: Via Vercel Dashboard

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **New Project**
4. Import your repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**

### Option 2: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

## 📱 Mobile-First Design

The application is optimized for mobile devices:
- Responsive layout adapts to all screen sizes
- Large, touch-friendly buttons
- Step-by-step guided booking flow
- Minimal and clean UI

## 🔐 Security Features

- Row Level Security (RLS) on all tables
- Server-side validation for appointments
- Double booking prevention
- Secure authentication via Supabase Auth
- Protected admin routes via middleware

## 🧪 Testing Locally

1. **Create a Business Account**
   - Go to `/login`
   - Sign up with email/password
   - Set business name and slug

2. **Set Up Services**
   - Go to `/dashboard/services`
   - Add services with duration

3. **Configure Business Hours**
   - Go to `/dashboard/hours`
   - Set operating hours for each day

4. **Test Booking**
   - Visit `/:your-slug`
   - Complete the booking flow
   - Verify appointment appears in dashboard

## 📊 Project Structure

```
appointment-scheduler/
├── app/
│   ├── [slug]/           # Public booking pages
│   ├── dashboard/        # Admin pages
│   ├── login/            # Authentication
│   └── layout.tsx
├── components/
│   ├── booking/          # Booking flow components
│   └── ...
├── lib/
│   ├── supabase/         # Supabase clients
│   └── utils/            # Utility functions
├── services/             # Data layer
│   ├── appointments.ts
│   ├── services.ts
│   ├── business-hours.ts
│   └── users.ts
├── supabase/
│   └── migrations/       # Database migrations
└── types/                # TypeScript types
```

## 🤝 Contributing

This is a production-ready template. Feel free to:
- Customize the UI
- Add new features
- Improve existing functionality
- Report issues

## 📄 License

MIT License - feel free to use for commercial projects

## 🆘 Support

For issues or questions:
1. Check the Supabase logs
2. Review browser console for errors
3. Verify environment variables are set correctly
4. Ensure RLS policies are properly configured

## 🔄 Future Enhancements

Potential features to add:
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Payment integration
- [ ] Multi-location support
- [ ] Staff management
- [ ] Custom branding
- [ ] Analytics dashboard
- [ ] Calendar sync (Google, Apple)

## ✅ Production Checklist

Before going live:
- [ ] Configure custom domain
- [ ] Set up Supabase production database
- [ ] Enable Supabase Auth email confirmations
- [ ] Configure SMTP for email sending
- [ ] Set up monitoring and error tracking
- [ ] Test all user flows
- [ ] Verify RLS policies
- [ ] Set up backups
- [ ] Add privacy policy and terms

---

Built with ❤️ using Next.js and Supabase
