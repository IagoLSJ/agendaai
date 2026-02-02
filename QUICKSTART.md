# Quick Start Guide

Get your appointment scheduler running in 10 minutes!

## Step 1: Install Dependencies (2 minutes)

```bash
cd appointment-scheduler
npm install
```

## Step 2: Set Up Supabase (3 minutes)

1. Go to [supabase.com](https://supabase.com) and create account
2. Click **New Project**
3. Name it and wait for creation
4. Go to **SQL Editor**
5. Copy and paste entire `supabase/migrations/20240101000000_initial_schema.sql`
6. Click **Run**

## Step 3: Configure Environment (1 minute)

1. In Supabase, go to **Settings** → **API**
2. Copy **Project URL** and **anon public** key
3. Create `.env.local` file in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Run Development Server (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Create Your Account (1 minute)

1. Click **Business Login**
2. Click **Sign up** link
3. Fill in:
   - Your Name: "John Smith"
   - Business Name: "John's Barbershop"
   - Business Slug: "johns-barbershop"
   - Email & Password
4. Click **Create Account**

## Step 6: Add Services (1 minute)

1. Go to **Services** tab
2. Add a service:
   - Name: "Haircut"
   - Duration: 30 minutes
3. Click **Add Service**

## Step 7: Set Hours (1 minute)

1. Go to **Business Hours** tab
2. Check Monday-Friday
3. Set hours (e.g., 9:00 AM - 5:00 PM)
4. Click **Save Business Hours**

## Step 8: Test Booking

1. Click **View Booking Page** in header
2. Go through booking flow:
   - Select service
   - Choose tomorrow's date
   - Pick a time slot
   - Enter name and WhatsApp
   - Confirm
3. Return to dashboard to see appointment!

## ✅ You're Done!

Your booking page is live at: `http://localhost:3000/johns-barbershop`

## Next Steps

- **Deploy**: See `DEPLOYMENT.md` for production deployment
- **Customize**: Modify colors in `tailwind.config.ts`
- **Add features**: Check `ARCHITECTURE.md` for extending

## Need Help?

Common issues:

**"Module not found" error**
```bash
rm -rf node_modules
npm install
```

**"Invalid API key" error**
- Check `.env.local` file exists
- Verify keys are correct from Supabase
- Restart dev server

**No available time slots**
- Ensure business hours are configured
- Check you selected an open day
- Verify RLS policies ran correctly

**Can't see appointments**
- Refresh the page
- Check browser console for errors
- Verify appointment was created in Supabase dashboard

## Pro Tips

1. **Use the same email** for Supabase and your app account
2. **Test the booking flow** before sharing with customers
3. **Set realistic time slots** - avoid back-to-back bookings
4. **Check Supabase logs** when debugging issues

## Share Your Booking Page

Once deployed, share: `yourdomain.com/your-slug`

---

**Happy Scheduling! 🎉**
