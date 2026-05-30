# Flipmark

Flipmark is a Vite + React grocery storefront built around Supabase-backed product data, local commerce state, and a contact form powered by EmailJS.

## Tech Stack

- React 18
- Vite 5
- Supabase JavaScript client
- EmailJS browser SDK

## Features

- Home landing page with hero content, featured categories, trending products, and full catalog browsing.
- In-app page navigation for Home, Products, History, and Contact with smooth route transitions.
- Product search, category filtering, sort modes, price filters, and grid/list views.
- Cart drawer with promo code support, checkout summary, and payment simulation flows.
- Wishlist and order history persistence with Supabase sync when a valid user session exists.
- OTP verification modal for checkout confirmation.
- Contact form submission through EmailJS.
- Responsive layout for desktop and mobile.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A Supabase project
- An EmailJS account if you want the contact form to send messages

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the project root and provide these values:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

Notes:

- The app reads Vite-style variables only. Use `.env` or `.env.local`.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are used by `src/supabase.js`.
- The contact form requires the three EmailJS variables before it can send messages.
- The code currently includes fallback Supabase values for development, but production deployments should set explicit environment variables.

## Data Flow

### Supabase

The app reads and writes product and commerce data through Supabase.

Expected tables used by the app:

- `product`
	- Read by the storefront to load catalog items.
	- Fields used in the app: `id`, `name`, `price`, `category`, `imageUrl`, `created_at`.
- `orders`
	- Inserted when a direct order or checkout flow is completed.
	- Fields used in the app: `user_id`, `product_id`, `quantity`, `created_at`.
- `history`
	- Used to persist and reload purchase history.
	- Fields used in the app: `id`, `user_id`, `product_id`, `quantity`, `date`.
- `wishlist`
	- Used to persist saved items for authenticated users.
	- Fields used in the app: `user_id`, `product_id`.

Recommended Supabase requirements:

- Enable Row Level Security policies appropriate for your auth model.
- Allow anonymous `SELECT` access to `product` if you want the storefront to load without signing in.
- Allow authenticated users to manage their own `orders`, `history`, and `wishlist` rows.

### Local State

The app also keeps some user-specific state in browser localStorage:

- `flipmark-local-auth` for the locally stored auth fallback.
- `flipmark-state:<user>` for cart, wishlist, orders, and related session state.

## Project Structure

- `src/App.jsx` - main application state, product loading, auth, cart, checkout, navigation, and Supabase sync.
- `src/Home.jsx` - landing page, search bar, featured categories, and storefront navigation.
- `src/History.jsx` - order history view.
- `src/Contact.jsx` - contact form and support details.
- `src/OtpVerificationModal.jsx` - OTP confirmation modal used during checkout.
- `src/supabase.js` - Supabase client initialization.
- `src/styles.css` - global styles, layout system, and page transition animation.
- `src/main.jsx` - React entry point.

## Navigation Behavior

- Home routes to the landing page and scrolls to the top.
- Products routes to the catalog section on the home page.
- History opens the order history screen.
- Contact opens the contact screen.
- Page swaps use a lightweight enter animation for smoother transitions.

## Implementation Notes

- Product data is fetched from Supabase on load and rendered into the storefront.
- Search and category changes are handled in the React app state.
- Cart and wishlist actions are stored locally first and mirrored to Supabase when a user session exists.
- Order status updates are simulated in the UI after checkout.
- The contact form uses `emailjs.sendForm(...)` and shows a message if EmailJS is not configured.

## Troubleshooting

- If products do not load, check your Supabase URL, anon key, table name, and RLS policy.
- If history or wishlist data is empty, verify the authenticated user session and table permissions.
- If the contact form does not send, confirm all three EmailJS environment variables are present.
- If page transitions look abrupt in reduced-motion environments, the app will intentionally disable animation for accessibility.
