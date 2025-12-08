# Venezuela Strike Displacement Scenario Builder

Interactive tool for modeling projected civilian displacement from hypothetical U.S. strikes on Venezuelan military and strategic targets.

**Authors:** Gil Guerra and Claire Holba, Niskanen Center

## Deployment to Vercel

### Option A: Via GitHub (Recommended)

1. Create a new GitHub repository
2. Push this folder's contents to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com) and sign in with GitHub
4. Click "Add New Project"
5. Import your GitHub repository
6. Vercel auto-detects Vite — just click "Deploy"
7. Your dashboard will be live at `https://your-project.vercel.app`

### Option B: Via Vercel CLI

1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in this directory
3. Follow the prompts

## Embedding on Niskanen Website

Once deployed, embed with:

```html
<iframe 
  title="Venezuela Strike Displacement Scenario Builder" 
  src="https://your-vercel-url.vercel.app" 
  scrolling="no" 
  frameborder="0" 
  style="width: 0; min-width: 100% !important; border: none;" 
  height="900"
  data-external="1">
</iframe>
```

Adjust `height` as needed (900px recommended for full dashboard).

## Local Development

```bash
npm install
npm run dev
```

## Contact

Corrections & questions: gguerra@niskanencenter.org
