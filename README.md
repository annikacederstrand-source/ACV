# RAPID GeoPermit

AI-assisted geothermal permitting intelligence built on the DOE/NREL RAPID Toolkit.

## Repo structure

```
/
├── api/
│   └── chat.js          ← Vercel serverless function (CommonJS)
├── rapid-dashboard.html
├── rapid-new-project.html
├── package.json
├── vercel.json
└── README.md
```

## Deploy to Vercel — IMPORTANT STEPS

1. Push repo to GitHub
2. Import at vercel.com/new
3. **In Project Settings → General → Framework Preset → set to "Other"**
   (Vercel may auto-detect Next.js — override this manually)
4. **In Project Settings → Environment Variables → add:**
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key from console.anthropic.com
5. Redeploy

## Verify the API is working

After deploy, visit: `https://your-domain.vercel.app/api/chat`

You should see: `{"error":"Method not allowed"}` (a 405 JSON response)

If you see a Next.js HTML 404 page instead, the Framework Preset is still
set to Next.js. Go to Project Settings and manually set it to "Other", then redeploy.

## How it works

- `vercel.json` sets `"framework": null` to prevent Next.js auto-detection
- `api/chat.js` uses CommonJS (`module.exports`) for maximum Vercel compatibility
- The proxy conditionally adds `anthropic-beta: web-search-2025-03-05` only when
  the request body includes a web_search tool (Agent 2 verification calls)
