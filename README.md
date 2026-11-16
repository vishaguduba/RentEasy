# RentEasy

A responsive rental marketplace starter built with React + Vite.

## Included in this first phase
- Responsive customer-facing website for desktop and mobile
- Product catalogue with search and category filters
- Product detail and rental date selection modal
- Rental duration and price calculation in INR
- Demo booking confirmation and session-only booking count

## Requirements
- Node.js 20.19+ or 22.12+
- npm
- VS Code (recommended)

## Run locally
1. Extract the ZIP.
2. Open the `renteasy` folder in VS Code.
3. Open Terminal > New Terminal.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed in the terminal (usually http://localhost:5173).

## Important current limitations
This is Phase 1 frontend. Demo bookings are stored only in browser memory. There is no live database, user login, payment, real inventory lock, admin panel, or confirmed availability yet. Do not accept real customer bookings until those features are connected and tested.

## Next phases
1. Connect Supabase authentication, database and product image storage.
2. Build secure admin product and inventory management.
3. Add server-side availability checks to prevent overlapping bookings.
4. Add customer booking history, returns, extensions and late fee rules.
5. Add payment integration after business and refund rules are decided.
6. Deploy to Cloudflare Pages and connect a custom domain if desired.
