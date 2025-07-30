# PowerShell script to add environment variables to Vercel
Write-Output "Adding DATABASE_URL to Vercel..."
$databaseUrl = "postgresql://postgres:k3O3khXNrI4SpBnL@db.fjkcycmqktcyyekxhxgt.supabase.co:5432/postgres"
Write-Output "DATABASE_URL: $databaseUrl"

Write-Output "Adding NEXT_PUBLIC_SUPABASE_URL to Vercel..."
$supabaseUrl = "https://fjkcycmqktcyyekxhxgt.supabase.co"
Write-Output "NEXT_PUBLIC_SUPABASE_URL: $supabaseUrl"

Write-Output "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel..."
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqa2N5Y21xa3RjeXlla3hoeGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0Njg1OTIsImV4cCI6MjA2OTA0NDU5Mn0.PBVihNuQ-COCpMJUSt6v6ePm5n_WH26fG2Nqq5XxX5k"
Write-Output "NEXT_PUBLIC_SUPABASE_ANON_KEY: $anonKey"

Write-Output "Please add these environment variables manually in the Vercel dashboard:"
Write-Output "1. Go to https://vercel.com/dashboard"
Write-Output "2. Select your project: perfume_selling-main"
Write-Output "3. Go to Settings > Environment Variables"
Write-Output "4. Add the following variables:"
Write-Output "   - DATABASE_URL: $databaseUrl"
Write-Output "   - NEXT_PUBLIC_SUPABASE_URL: $supabaseUrl"
Write-Output "   - NEXT_PUBLIC_SUPABASE_ANON_KEY: $anonKey" 