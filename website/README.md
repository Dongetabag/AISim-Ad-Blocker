# AISim AdBlocker Landing Page

This is the landing page/website for the AISim AdBlocker Chrome extension.

## Deployment to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy from the website directory:
```bash
cd website
vercel
```

3. Follow the prompts to deploy

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import the `AISim-Ad-Blocker` repository
5. Set the root directory to `website`
6. Deploy

### Option 3: GitHub Integration

1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to main
3. Configure the project to use the `website` directory as root

## Local Development

To test locally:

```bash
cd website
python3 -m http.server 8000
# Or use any static file server
```

Then open http://localhost:8000 in your browser.

## What This Website Provides

- Landing page for the extension
- Feature highlights
- Installation instructions
- Download links
- Version information
- Privacy policy statement

## Updating the Website

After releasing a new version of the extension:

1. Update the version number in `index.html`
2. Update the "What's New" section with new features
3. Commit and push changes
4. Vercel will auto-deploy (if connected)
