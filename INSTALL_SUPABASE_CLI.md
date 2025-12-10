# Install Supabase CLI on Windows

Since npm global installation is not supported, use one of these methods:

## Method 1: Download Binary Directly (Recommended)

1. Go to: https://github.com/supabase/cli/releases/latest
2. Download: `supabase_windows_amd64.zip` (or appropriate for your system)
3. Extract the zip file
4. Add the extracted folder to your PATH, or run from the extracted location

## Method 2: Use npx (No Installation Required)

You can use Supabase CLI via npx without installing:

```powershell
npx supabase --version
npx supabase login
npx supabase projects list
```

## Method 3: Install via Scoop (If Available)

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

## After Installation

Once Supabase CLI is available, you can:

1. Login:
   ```powershell
   supabase login
   ```

2. Link your project:
   ```powershell
   supabase link --project-ref [YOUR-PROJECT-REF]
   ```

3. Deploy functions:
   ```powershell
   cd supabase
   supabase functions deploy create-checkout-session
   supabase functions deploy create-one-time-checkout-session
   supabase functions deploy stripe-webhook
   ```

4. Set secrets:
   ```powershell
   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
   # ... etc
   ```

## Alternative: Use Supabase Dashboard

If CLI installation is problematic, you can complete the setup entirely via the Supabase Dashboard. See `STRIPE_SETUP_COMPLETE_INSTRUCTIONS.md` for Dashboard instructions.

