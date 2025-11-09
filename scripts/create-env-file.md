# Create .env File - Instructions

## ⚠️ IMPORTANT

The `.env` file is **blocked from being created automatically** for security reasons. You need to create it manually.

## Steps to Create .env File

### 1. Create the File

Create a new file named `.env` in the project root directory:
```
cybercorrect-complete-privacy/
  └── .env  ← Create this file here
```

### 2. Add Content

Copy and paste this content into the `.env` file:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo

# Optional: Stripe Configuration (for payments)
# VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Optional: SendGrid Configuration (for emails)
# SENDGRID_API_KEY=SG....

# Optional: Sentry Configuration (for error monitoring)
# VITE_SENTRY_DSN=https://...
```

### 3. Verify File Location

Make sure the `.env` file is in the **project root**, same level as `package.json`:

```
cybercorrect-complete-privacy/
  ├── .env              ← Here
  ├── package.json
  ├── src/
  ├── supabase/
  └── ...
```

### 4. Verify .gitignore

The `.env` file should already be in `.gitignore`. Verify it's there:

```bash
# Check .gitignore
cat .gitignore | grep .env
```

You should see `.env` listed. If not, add it.

### 5. Test the Setup

After creating the `.env` file:

1. **Restart your dev server** (if running):
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart
   npm run dev
   ```

2. **Test connection**:
   ```bash
   npm run supabase:test
   ```

3. **Verify setup**:
   ```bash
   npm run supabase:verify
   ```

## ⚠️ Security Notes

- **Never commit `.env` file** to Git
- **Never share** your API keys publicly
- **Rotate keys** if compromised
- **Use different keys** for development and production

## Troubleshooting

### File Not Found?

- Make sure the file is named exactly `.env` (with the dot)
- Make sure it's in the project root (same level as `package.json`)
- Check file permissions

### Variables Not Loading?

- Restart your dev server after creating `.env`
- Make sure variable names start with `VITE_` for client-side access
- Check for typos in variable names

### Still Not Working?

1. Check `.env` file location
2. Verify file content is correct
3. Restart dev server
4. Check console for errors

## Next Steps

After creating `.env` file:

1. ✅ `.env` file created
2. ⏭️ Apply database migrations (see `APPLY_MIGRATIONS.md`)
3. ⏭️ Verify setup (run `npm run supabase:verify`)
4. ⏭️ Deploy Edge Functions
5. ⏭️ Test the application

---

**Status**: Ready to create `.env` file manually! 🚀

