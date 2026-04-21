# RAPID GeoPermit

AI-assisted geothermal permitting intelligence, built on the DOE/NREL RAPID Toolkit.

## Repo Structure

```
/
├── api/
│   └── chat.js                  # Vercel serverless function — Anthropic API proxy
├── rapid-dashboard.html         # Main permit dashboard
├── rapid-new-project.html       # New project permit wizard
├── vercel.json                  # Routing config
└── README.md
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [vercel.com/new](https://vercel.com/new)
3. Add environment variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your Anthropic API key (from console.anthropic.com)
4. Deploy — Vercel auto-detects the `api/` folder as serverless functions

## How it works

- All permit data (22 federal/state permits, CFR citations, timelines) is hardcoded in the HTML — zero API tokens used for permit matching
- The Anthropic API is only called once per project generation, for a 3-sentence project-specific narrative
- `api/chat.js` proxies that call server-side so the API key is never exposed in the browser
