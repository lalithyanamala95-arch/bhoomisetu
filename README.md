This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-typescript).

### Deployment steps

1. Push this repo to GitHub, GitLab, or Bitbucket.
2. Create a new project in Vercel and import the repo.
3. Use the default settings:
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: leave blank
4. Add required environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` (optional, used for internal URL generation)

### Local environment

Copy `.env.example` to `.env.local` and fill in your own values.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## BhoomiSetu production additions

### Supabase

Run `supabase/001_bhoomisetu_platform.sql` in the Supabase SQL Editor. It adds property image storage metadata, the premium purchase ledger, RLS policies, and the `land-images` bucket.

### Admin

Set `ADMIN_EMAILS` to the comma-separated email(s) that should access `/admin`. Set `SUPABASE_SERVICE_ROLE_KEY` only in server/Vercel environment variables; never expose it to client code.

### Premium reports / Razorpay

The property detail page exposes a deliberately limited public profile. A signed-in buyer can unlock the full intelligence report per property. The default price is ₹99 and can be changed with `PREMIUM_PRICE_INR`.

Configure `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET`. Razorpay orders are created server-side and the returned signature is verified server-side before the purchase role is assigned.

Razorpay's current Standard Checkout documentation requires server-side order creation, server-side signature verification, and webhooks for reliable payment confirmation. See the official guide: [Razorpay Integration](https://razorpay.com/docs/payments/smart-collect/)

## Visual direction

The current interface uses a cinematic spatial-intelligence direction: dark architectural surfaces, restrained emerald signals, glass HUD panels, animated 3D terrain, parcel beacons and a dedicated terrain discovery map.
