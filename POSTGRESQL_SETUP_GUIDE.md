# PostgreSQL Setup Guide for Project X

This guide covers setting up standalone PostgreSQL databases for the Project X B2B Perfume Platform.

## Option A: Neon (Recommended)

[Neon](https://neon.tech) provides serverless PostgreSQL with branching capabilities.

### Step 1: Create Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub or email
3. Create a new project

### Step 2: Get Connection String

1. Go to your project dashboard
2. Click **Connection Details**
3. Copy the connection string
4. It looks like: `postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname`

### Step 3: Set Environment Variables

```env
DATABASE_URL="your-neon-connection-string"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Option B: PlanetScale

[PlanetScale](https://planetscale.com) offers MySQL-compatible database with branching.

### Step 1: Create PlanetScale Account

1. Go to [planetscale.com](https://planetscale.com)
2. Sign up and create a new database
3. Get your connection string

### Step 2: Update Prisma Schema

You'll need to update the Prisma schema to use MySQL:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

## Option C: Railway

[Railway](https://railway.app) provides easy PostgreSQL hosting.

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project
4. Add PostgreSQL service

### Step 2: Get Connection String

1. Go to your PostgreSQL service
2. Click **Connect**
3. Copy the connection string

## Option D: Local PostgreSQL

For development, you can run PostgreSQL locally.

### Step 1: Install PostgreSQL

**Windows:**

1. Download from [postgresql.org](https://postgresql.org)
2. Install with default settings
3. Remember the password you set

**macOS:**

```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu):**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE projectx;
CREATE USER projectx_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE projectx TO projectx_user;
\q
```

### Step 3: Set Connection String

```env
DATABASE_URL="postgresql://projectx_user:your_password@localhost:5432/projectx"
```

## Option E: AWS RDS

For production use, consider Amazon RDS.

### Step 1: Create RDS Instance

1. Go to AWS Console → RDS
2. Create PostgreSQL instance
3. Configure security groups
4. Get connection details

### Step 2: Connection String

```env
DATABASE_URL="postgresql://username:password@your-rds-endpoint:5432/dbname"
```

## Setup Steps (After Getting Connection String)

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Set Environment Variables

Create `.env.local`:

```env
DATABASE_URL="your-connection-string"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 3: Generate Prisma Client

```bash
pnpm prisma generate
```

### Step 4: Run Migrations

```bash
pnpm prisma migrate deploy
```

### Step 5: Seed Database

```bash
pnpm prisma db seed
```

### Step 6: Test Connection

```bash
pnpm dev
```

## Troubleshooting

### Connection Issues

- Verify connection string format
- Check firewall settings
- Ensure database is running
- Test connection with `psql` or database client

### Migration Issues

```bash
# Reset database
pnpm prisma migrate reset

# Create new migration
pnpm prisma migrate dev --name init

# Check database schema
pnpm prisma db pull
```

### SSL Issues

For some providers, you may need SSL:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

## Security Considerations

1. **Use strong passwords**
2. **Enable SSL connections**
3. **Restrict database access**
4. **Use connection pooling**
5. **Never commit credentials to Git**

## Production Deployment

When deploying to Vercel:

1. Add `DATABASE_URL` to Vercel environment variables
2. Use production database instance
3. Enable SSL connections
4. Set up proper database policies

## Database Providers Comparison

| Provider    | Free Tier | SSL | Connection Pooling | Branching |
| ----------- | --------- | --- | ------------------ | --------- |
| Supabase    | Yes       | Yes | Yes                | Yes       |
| Neon        | Yes       | Yes | Yes                | Yes       |
| PlanetScale | Yes       | Yes | Yes                | Yes       |
| Railway     | Yes       | Yes | Yes                | No        |
| AWS RDS     | No        | Yes | Yes                | No        |

## Support

- **Neon Documentation**: [neon.tech/docs](https://neon.tech/docs)
- **PlanetScale Documentation**: [planetscale.com/docs](https://planetscale.com/docs)
- **Railway Documentation**: [railway.app/docs](https://railway.app/docs)
- **PostgreSQL Documentation**: [postgresql.org/docs](https://postgresql.org/docs)
