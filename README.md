# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Deploying to Vercel

To deploy this webapp to [Vercel](https://vercel.com):

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/import](https://vercel.com/import) and import your project.
3. Set the **Framework Preset** to `Vite`.
4. If you use environment variables, add them in the Vercel dashboard under **Project Settings > Environment Variables**.
5. The default build command is `npm run build` and the output directory is `dist`.
6. After deployment, your site will be live on your Vercel domain.

### Notes
- Make sure all API endpoints in your code point to the correct production backend URL (not localhost).
- For static assets, use relative paths or `/public` as needed.
- For custom domains, configure them in the Vercel dashboard.

For more details, see the [Vercel documentation](https://vercel.com/docs).
