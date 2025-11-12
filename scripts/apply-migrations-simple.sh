#!/bin/bash
# Simple script to apply migrations using Supabase CLI
# 
# Prerequisites:
# - npm install -g supabase
# - supabase login
# - supabase link --project-ref achowlksgmwuvfbvjfrt

echo "🚀 Applying Database Migrations to Supabase"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Check if logged in
echo "📋 Checking Supabase CLI status..."
supabase status

# Apply migrations
echo ""
echo "📄 Applying migrations..."
echo ""

# Apply all migrations in order
supabase db push

echo ""
echo "✅ Migrations applied!"
echo ""
echo "📊 Next steps:"
echo "1. Verify tables in Supabase Dashboard → Table Editor"
echo "2. Run: npx tsx scripts/verify-supabase-setup.ts"
echo "3. Deploy Edge Functions"
echo ""

