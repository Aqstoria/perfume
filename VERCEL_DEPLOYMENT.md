# Vercel Deployment Guide for Project X

This guide will help you deploy the Project X B2B Perfume Platform to Vercel.

## Prerequisites

1. **GitHub Repository**: Your project must be pushed to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Database**: Set up a PostgreSQL database (recommended: Supabase)
4. **Supabase Account**: For file storage (optional but recommended)

## Step 1: Prepare Your Database

### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > Database to get your connection string
4. Run the following commands locally to set up your database:

```bash
# Install dependencies
pnpm install

# Set your database URL
export DATABASE_URL="your-supabase-connection-string"

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy

# Seed the database (optional)
pnpm prisma db seed
```

### Option B: Other PostgreSQL Providers

- **Neon**: [neon.tech](https://neon.tech)
- **PlanetScale**: [planetscale.com](https://planetscale.com)
- **Railway**: [railway.app](https://railway.app)

## Step 2: Set Up Supabase Storage (Optional)

1. In your Supabase project, go to Storage
2. Create a new bucket called `product-images`
3. Set the bucket to public
4. Note your Supabase URL and keys

## Step 3: Deploy to Vercel

### Method A: Vercel Dashboard

1. **Connect GitHub Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

2. **Configure Project Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `prisma generate && next build`
   - **Install Command**: `pnpm install`
   - **Output Directory**: `.next`

3. **Environment Variables**
   Add these environment variables in the Vercel dashboard:

   ```env
   # Database
   DATABASE_URL=your-database-connection-string

   # Authentication
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=https://your-domain.vercel.app

   # Supabase (if using)
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # Sentry (optional)
   SENTRY_DSN=your-sentry-dsn
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Method B: Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new
   - Set environment variables
   - Deploy

## Step 4: Post-Deployment Setup

### 1. Update NEXTAUTH_URL

After deployment, update your `NEXTAUTH_URL` environment variable to your actual Vercel domain.

### 2. Run Database Migrations

```bash
# Connect to your Vercel project
vercel env pull .env.local

# Run migrations
pnpm prisma migrate deploy
```

### 3. Seed Database (Optional)

```bash
# Run seed script
pnpm prisma db seed
```

## Step 5: Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` to your custom domain

## Environment Variables Reference

| Variable                        | Description                  | Required |
| ------------------------------- | ---------------------------- | -------- |
| `DATABASE_URL`                  | PostgreSQL connection string | Yes      |
| `NEXTAUTH_SECRET`               | Secret for NextAuth.js       | Yes      |
| `NEXTAUTH_URL`                  | Your app's URL               | Yes      |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL         | No       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key       | No       |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key    | No       |
| `SENTRY_DSN`                    | Sentry error tracking        | No       |

## Troubleshooting

### Build Errors

1. **Prisma Generation Fails**
   - Ensure `DATABASE_URL` is set correctly
   - Check database connectivity

2. **Environment Variables Missing**
   - Verify all required env vars are set in Vercel dashboard
   - Redeploy after adding variables

3. **Database Connection Issues**
   - Check if your database allows external connections
   - Verify connection string format

### Runtime Errors

1. **Authentication Issues**
   - Verify `NEXTAUTH_URL` matches your domain
   - Check `NEXTAUTH_SECRET` is set

2. **Database Migration Issues**
   - Run `pnpm prisma migrate deploy` locally
   - Check database permissions

## Performance Optimization

1. **Enable Vercel Analytics**
   - Go to project settings
   - Enable Analytics

2. **Configure Edge Functions**
   - API routes are automatically optimized
   - Consider using Edge Runtime for faster responses

3. **Image Optimization**
   - Next.js Image component is automatically optimized
   - Configure image domains in `next.config.js`

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to Git
   - Use Vercel's environment variable encryption

2. **Database Security**
   - Use connection pooling
   - Enable SSL connections
   - Restrict database access

3. **Authentication**
   - Use strong `NEXTAUTH_SECRET`
   - Enable HTTPS only
   - Configure proper redirect URLs

## Monitoring

1. **Vercel Analytics**
   - Monitor performance metrics
   - Track user behavior

2. **Sentry Integration**
   - Error tracking and monitoring
   - Performance monitoring

3. **Database Monitoring**
   - Monitor query performance
   - Set up alerts for issues

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Documentation**: [prisma.io/docs](https://prisma.io/docs)

---

**Note**: This deployment guide assumes you have already pushed your code to GitHub. If you haven't, please follow the GitHub setup instructions first.
