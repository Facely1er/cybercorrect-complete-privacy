# Supabase Credentials - Setup Instructions

## 🔐 Your Supabase Credentials

**⚠️ IMPORTANT**: Keep these credentials secure. Never commit them to Git.

### Project Information

- **Project URL**: `https://achowlksgmwuvfbvjfrt.supabase.co`
- **Project Reference**: `achowlksgmwuvfbvjfrt`

### API Keys

**Anon Key** (for client-side):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo
```

**Service Role Key** (for Edge Functions only - NEVER expose to client):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
```

---

## 🚀 Quick Start

### 1. Create `.env` File

Create a `.env` file in the project root with:

```bash
VITE_SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo
```

**⚠️ IMPORTANT**: 
- The `.env` file is already in `.gitignore` - it won't be committed
- Never commit this file to Git
- For production, set these in your deployment platform

### 2. Apply Database Migrations

See `APPLY_MIGRATIONS.md` for detailed step-by-step instructions.

**Quick Method**:
1. Go to https://app.supabase.com
2. Select project: **achowlksgmwuvfbvjfrt**
3. Open **SQL Editor**
4. Apply migrations in order from `supabase/migrations/` folder

### 3. Verify Setup

Run the verification script:

```bash
npx tsx scripts/verify-supabase-setup.ts
```

### 4. Deploy Edge Functions

See `scripts/setup-supabase.md` for detailed instructions.

---

## 📚 Documentation

- **Quick Setup**: See `SUPABASE_SETUP_COMPLETE.md`
- **Migration Guide**: See `APPLY_MIGRATIONS.md`
- **Full Setup**: See `scripts/setup-supabase.md`

---

## 🔒 Security Notes

⚠️ **CRITICAL SECURITY RULES**:

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Never expose Service Role Key** - Only use in Edge Functions
3. **Rotate keys regularly** - Change keys if compromised
4. **Use Anon Key in client** - Service Role Key is server-side only
5. **Set RLS policies** - All tables have Row Level Security enabled

---

## ✅ Next Steps

1. ✅ Create `.env` file with credentials
2. ⏭️ Apply database migrations (see `APPLY_MIGRATIONS.md`)
3. ⏭️ Verify setup (run verification script)
4. ⏭️ Deploy Edge Functions (see `scripts/setup-supabase.md`)
5. ⏭️ Configure Stripe (for payments)
6. ⏭️ Configure SendGrid (for emails)
7. ⏭️ Test the application

---

**Status**: Credentials provided - Ready to set up! 🚀

