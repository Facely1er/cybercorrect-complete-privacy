#!/bin/bash

# Production Deployment Script
# This script helps deploy the CyberCorrect Privacy Platform to production

set -e  # Exit on error

echo "🚀 CyberCorrect Privacy Platform - Production Deployment"
echo "========================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env.production not found${NC}"
    echo "Creating from .env.production.example..."
    cp .env.production.example .env.production
    echo -e "${RED}❌ Please fill in .env.production with your production values${NC}"
    echo "Then run this script again."
    exit 1
fi

# Check required environment variables
echo "📋 Checking environment variables..."
source .env.production

REQUIRED_VARS=(
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY"
    "VITE_STRIPE_PUBLISHABLE_KEY"
    "VITE_SITE_URL"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo ""
    echo "Please update .env.production and try again."
    exit 1
fi

echo -e "${GREEN}✅ All required environment variables set${NC}"
echo ""

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Supabase CLI not found${NC}"
    echo "Installing Supabase CLI..."
    npm install -g supabase
fi

# Check if logged in to Supabase
echo "🔐 Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Supabase${NC}"
    echo "Please run: supabase login"
    exit 1
fi

echo -e "${GREEN}✅ Authenticated with Supabase${NC}"
echo ""

# Deploy Edge Functions
echo "📦 Deploying Edge Functions..."
echo ""

echo "Deploying create-one-time-checkout-session..."
supabase functions deploy create-one-time-checkout-session

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to deploy create-one-time-checkout-session${NC}"
    exit 1
fi

echo "Deploying stripe-webhook..."
supabase functions deploy stripe-webhook

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to deploy stripe-webhook${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Edge Functions deployed successfully${NC}"
echo ""

# Summary
echo "========================================================"
echo -e "${GREEN}✅ Deployment Preparation Complete!${NC}"
echo "========================================================"
echo ""
echo "Next steps:"
echo "1. Deploy to your hosting platform (Vercel/Netlify/etc.)"
echo "2. Set environment variables in your hosting platform"
echo "3. Test the production deployment"
echo "4. Monitor logs and errors"
echo ""
echo "For detailed instructions, see:"
echo "- STRIPE_PRODUCTION_SETUP.md"
echo "- DEPLOY_EDGE_FUNCTIONS.md"
echo "- PRODUCTION_DEPLOYMENT_CHECKLIST.md"
echo ""

