# MakeoverPortfolio

Rebuild target: clone `yortechva` content into `nhaziel` layout.
Positioning: automation specialist for hire (proof-first).

## Sources (content)

- Old: `C:/Users/Chuybi/Downloads/Photo/Portfolio` (`projects_data.json` copied to `data/yortechva-projects.json`, 14 projects)
- New layout base: `C:/Users/Chuybi/Documents/HazielPortfolio/haziel-next` (Next.js 16, React 19, framer-motion)
- Logo canonical: `public/logo-y-cool.svg` (833B refined Y, dark-modern). Reference variant: `public/logo-y-cool-supplied.svg`

## Filter (per your answers)

Above fold: n8n / Zapier / GHL workflows only. Voice/CRM as supporting proof, not hero.

## Env (consolidated, local only)

`.env.local` (29 keys, gitignored) merged low→high:
`Talker/.env` → `project_management/.env` → `project_management/.env.local` → `main/.env.local`

| Key | Source | Use |
|---|---|---|
| VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY / SUPABASE_SERVICE_ROLE_KEY | main | Supabase app + scripts |
| VITE_DEMO_ADMIN_PASSWORD / DEV_* | main | Local dev logins |
| GMAIL_ADDRESS / GMAIL_APP_PASSWORD / YDAVID_GMAIL_APP_PASSWORD | main+pm | Gmail/SMTP scripts |
| CLUBWORX_API_KEY | pm | Attendance sync (server only) |
| VITE_WAIVER_URL / STRIPE_SECRET_KEY / HIGH_LEVEL* | main | Links, payments, GHL |
| GOOGLE_SA_KEY_PATH / ALIBABA_TOKENPLAN_APIKEY / VITE_FF_* | main | Sheets/forms automation |
| ANDROID_KEYSTORE_* | main | Play upload (local only) |
| COC_API_TOKEN / COC_PLAYER_TAG | main | Skill coc-progress, read-only |
| TELEGRAM_* | pm | Ops notifications |
| GROQ_API_KEY / OpenAi_API_Key | Talker/alpha-app | Talker demos |

No values in repo. See `.env.example`. Rotate any token pasted in chat.

## Skills

Global `~/.agents/skills` (47) vs local `skills-repo` (17):
- Identical: `gh-axi`, `implement`
- Global newer (2026-10-06): `code-review`, `domain-modeling`, `first-mate`, `grilling` (frontier/rounds upgrade), `tdd`, `to-spec`, `to-tickets`, `teach`, `setup-*`, `wayfinder`
- Local-only copied: `chrome-devtools-axi`, `commandcode-design`, `data-flow-diagrams`, `to-issues`, `write-a-skill`
- Note: `wayfinder` global trimmed delivery handoff; local `skills-repo/wayfinder` keeps `$to-spec → $to-tickets → $implement → $code-review` handoff. `teach` local has Mission/Lessons state machine; global refactored to fluency/storage.
- Synced 37 missing into `~/.config/opencode/skills` (now 69 entries). Kept existing `grill-me`, added `grilling` + `grill-with-docs` stubs.

UI stack for rebuild: `design-taste-frontend` + `vercel-react-best-practices` (already loaded).

## Next

1. Scaffold Next.js from `haziel-next`, swap Haziel content for `data/yortechva-projects.json`
2. Hero: automation headline + 3 proof metrics + Y logo + single CTA
3. Sections: n8n/Zapier/GHL grid → workflow → experience → contact
