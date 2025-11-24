#!/bin/bash
# Deploy all Edge Functions to Supabase
# 
# Prerequisites:
# - npm install -g supabase
# - supabase login
# - supabase link --project-ref achowlksgmwuvfbvjfrt

echo "🚀 Deploying Edge Functions to Supabase"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Functions to deploy
FUNCTIONS=(
    "send-email-notification"
    "stripe-webhook"
    "generate-automated-reports"
    "run-scheduled-assessments"
    "track-compliance-health"
    "check-regulatory-updates"
)

# Deploy each function
for func in "${FUNCTIONS[@]}"; do
    echo "📦 Deploying $func..."
    supabase functions deploy "$func"
    
    if [ $? -eq 0 ]; then
        echo "✅ $func deployed successfully"
    else
        echo "❌ Failed to deploy $func"
    fi
    echo ""
done

echo "✅ All Edge Functions deployment complete!"
echo ""
echo "📊 Next steps:"
echo "1. Configure function secrets in Supabase Dashboard"
echo "2. Test functions"
echo ""

