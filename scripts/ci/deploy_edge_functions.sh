#!/usr/bin/env bash
set -euo pipefail

if [ -z "${SUPABASE_ACCESS_TOKEN:-}" ] || [ -z "${SUPABASE_PROJECT_REF:-}" ]; then
  echo "Set SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF" >&2
  exit 1
fi

cd "$(dirname "$0")/../.."

export SUPABASE_DB_URL="https://$SUPABASE_PROJECT_REF.supabase.co"

npx supabase functions deploy taskController --project-ref "$SUPABASE_PROJECT_REF"
npx supabase functions deploy checkProxyHealth --project-ref "$SUPABASE_PROJECT_REF"
npx supabase functions deploy generateFingerprintProfile --project-ref "$SUPABASE_PROJECT_REF"
npx supabase functions deploy updateVantaTraining --project-ref "$SUPABASE_PROJECT_REF"
npx supabase functions deploy uploadPersonas --project-ref "$SUPABASE_PROJECT_REF"

# Set secrets on functions
npx supabase secrets set SUPABASE_URL="https://$SUPABASE_PROJECT_REF.supabase.co" SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" --project-ref "$SUPABASE_PROJECT_REF"

echo "Deployed edge functions."