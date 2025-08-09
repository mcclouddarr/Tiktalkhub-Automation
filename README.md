# Tiktalkhub - Supabase Integration

## Supabase Environment
Create `.env`:

```
VITE_SUPABASE_URL=YOUR_URL
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## Install

```
npm i
npm run dev
```

## Database Schema
Run the SQL in `supabase/schema.sql` in your Supabase project SQL editor. Create Storage buckets `cookies`, `screenshots`, `logs` and set public access as needed.

## Edge Functions
Deploy from the Supabase CLI or Dashboard:
- `checkProxyHealth`
- `updateVantaTraining`
- `generateFingerprintProfile`

Provide `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as function secrets.

## Clients
The app uses `@supabase/supabase-js` with configuration in `src/lib/supabaseClient.ts`. Authentication is handled via email/password; anonymous sign-in placeholder provided.

## Realtime
Realtime subscriptions for `sessions` are set up in `src/hooks/useRealtimeSessions.ts`.
