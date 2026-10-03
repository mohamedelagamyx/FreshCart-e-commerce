# FreshCart

A grocery e-commerce application built with Next.js, React, TypeScript, and Tailwind CSS. Includes product browsing, categories, brands, accounts, a cart, a wishlist, addresses, and checkout using the Route e-commerce API.

## Run locally

Use Node.js 22 and npm.

```sh
npm ci
```

Copy `.env.example` to `.env.local` and adjust the API URL if needed:

```env
NEXT_PUBLIC_API_BASE_URL=https://ecommerce.routemisr.com
```

```sh
npm run dev
```


## Production checks

```sh
npm run build
npm run typecheck
```

To run the production build locally:

```sh
npm start
```

## Upload to GitHub

Create an empty GitHub repository without adding a README, license, or gitignore. From this project folder, run:

```sh
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Replace the placeholder URL with your repository URL. The local repository uses the `main` branch and includes an initial commit. Dependencies, build output, and local environment files are excluded by `.gitignore`; `.env.example` is included.

## Deploy on Vercel

Import the GitHub repository into Vercel with these settings:

- Framework preset: Next.js
- Root directory: repository root
- Node.js version: 22.x
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: leave the framework default
- Environment variable: `NEXT_PUBLIC_API_BASE_URL=https://ecommerce.routemisr.com`

Optional server environment variables are `AUTH_COOKIE_NAME` (default: `freshcart_token`) and `AUTH_COOKIE_MAX_AGE` (default: `2592000` seconds).

After deployment, verify product loading, sign-in, cart, wishlist, and checkout against the live API. Checkout uses the deployed request origin as its payment return URL.
