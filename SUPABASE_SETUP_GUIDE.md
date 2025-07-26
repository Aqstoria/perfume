# Supabase Setup Guide for Project X

This guide will help you set up Supabase as your database for the Project X B2B Perfume Platform.

## Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Create a new organization (if prompted)

## Step 2: Create New Project

1. Click "New Project"
2. Choose your organization
3. Fill in project details:
   - **Name**: `project-x-perfume-platform` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for setup to complete (2-3 minutes)

## Step 3: Get Database Connection String

1. Go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Select **URI** format
4. Copy the connection string that looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

## Step 4: Set Up Environment Variables

Create a `.env.local` file in your project root:

```env
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Supabase (for file storage)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

## Step 5: Get Supabase Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://[PROJECT-REF].supabase.co`
   - **anon public**: Your public API key
   - **service_role secret**: Your service role key

## Step 6: Set Up Database Schema

Run these commands in your project directory:

```bash
# Install dependencies (if not already done)
pnpm install

# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate deploy

# Seed the database with initial data
pnpm prisma db seed
```

## Step 7: Set Up File Storage (Optional)

1. Go to **Storage** in your Supabase dashboard
2. Click **Create a new bucket**
3. Name it `product-images`
4. Set it to **Public**
5. Click **Create bucket**

## Step 8: Test the Connection

Run the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` and test the application.

## Troubleshooting

### Connection Issues

- Verify your `DATABASE_URL` is correct
- Check that your database password is correct
- Ensure your IP is not blocked by firewall

### Migration Issues

```bash
# Reset database (WARNING: This will delete all data)
pnpm prisma migrate reset

# Or create a fresh migration
pnpm prisma migrate dev --name init
```

### Prisma Issues

```bash
# Regenerate Prisma client
pnpm prisma generate

# Check database connection
pnpm prisma db pull
```

## Security Best Practices

1. **Never commit `.env.local`** to Git
2. **Use environment variables** in production
3. **Enable Row Level Security** in Supabase
4. **Set up proper database policies**

## Production Deployment

When deploying to Vercel:

1. Add all environment variables to Vercel dashboard
2. Update `NEXTAUTH_URL` to your production domain
3. Use production database URL
4. Enable SSL connections

## Support

- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Prisma Documentation**: [prisma.io/docs](https://prisma.io/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
