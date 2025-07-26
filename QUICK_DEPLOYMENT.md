# Quick Deployment Guide - Project X to Vercel

This guide will help you deploy your Project X B2B Perfume Platform to Vercel quickly.

## Prerequisites

1. **GitHub Account** - Your code must be on GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Database** - You'll need a PostgreSQL database (Supabase recommended)

## Step 1: Push to GitHub

If you haven't pushed to GitHub yet:

```bash
# Initialize Git (if not already done)
git init
git add .
git commit -m "Initial commit: Project X B2B Perfume Platform"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up Database

### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Create account and new project
3. Go to Settings → Database
4. Copy the connection string
5. Create `.env.local` file:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Option B: Neon

1. Go to [neon.tech](https://neon.tech)
2. Create account and project
3. Get connection string
4. Create `.env.local` file with the connection string

## Step 3: Deploy to Vercel

### Method A: Vercel Dashboard (Easiest)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `prisma generate && next build`
   - **Install Command**: `pnpm install`
5. Add environment variables:
   - `DATABASE_URL` = your database connection string
   - `NEXTAUTH_SECRET` = your secret key
   - `NEXTAUTH_URL` = your Vercel domain (update after deployment)
6. Click "Deploy"

### Method B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

## Step 4: Post-Deployment Setup

### 1. Update NEXTAUTH_URL

After deployment, update `NEXTAUTH_URL` in Vercel dashboard to your actual domain.

### 2. Run Database Migrations

```bash
# Connect to your Vercel project
vercel env pull .env.local

# Run migrations
pnpm prisma migrate deploy

# Seed database (optional)
pnpm prisma db seed
```

### 3. Test Your Application

Visit your Vercel domain and test the application.

## Environment Variables for Vercel

Add these to your Vercel project settings:

| Variable                        | Description                              | Required |
| ------------------------------- | ---------------------------------------- | -------- |
| `DATABASE_URL`                  | Your database connection string          | Yes      |
| `NEXTAUTH_SECRET`               | Secret for NextAuth.js                   | Yes      |
| `NEXTAUTH_URL`                  | Your app's URL (update after deployment) | Yes      |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL (if using Supabase) | No       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key                   | No       |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key                | No       |

## Troubleshooting

### Build Errors

- Check that `DATABASE_URL` is correct
- Ensure all environment variables are set
- Verify `pnpm` is used in build command

### Database Connection Issues

- Verify your database allows external connections
- Check SSL settings if required
- Test connection locally first

### Authentication Issues

- Update `NEXTAUTH_URL` to your production domain
- Ensure `NEXTAUTH_SECRET` is set
- Check redirect URLs in NextAuth configuration

## Quick Commands

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy

# Seed database
pnpm prisma db seed

# Deploy to Vercel
vercel

# Update environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
```

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Note**: Make sure your database is accessible from Vercel's servers and all environment variables are properly configured.
