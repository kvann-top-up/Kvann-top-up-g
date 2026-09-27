# KVANN TOP UP

Neon gaming top-up website starter based on the supplied KVANN TOP UP design.

## 1. Run locally

Requirements: Node.js 18+

```bash
npm install
npm start
```

Open:

- Website: http://localhost:3000
- Admin demo: http://localhost:3000/admin.html

## 2. Included

- Responsive neon homepage
- Free Fire / PUBG Mobile / Mobile Legends
- Player ID input
- Package selection
- Payment method selector
- Order creation
- Order tracking
- Demo payment endpoint
- Demo top-up processing
- Admin order dashboard
- API structure ready for a real provider

## 3. Production integration

The current server intentionally uses an in-memory order store and a DEMO payment/top-up flow.

For a real store, replace:

- `orders = new Map()` with PostgreSQL/MySQL/MongoDB
- `/api/orders/:id/pay` with a verified payment-gateway webhook
- the `TODO` top-up section with an authorized/licensed top-up provider API
- admin page with authentication + role-based access
- hard-coded packages with database/provider catalog
- add HTTPS, rate limiting, input validation, audit logs and secrets in environment variables

Never put payment secret keys or top-up API keys in `public/app.js`.

## 4. API endpoints

GET `/api/games`

GET `/api/packages/:game`

POST `/api/orders`

```json
{
  "game": "freefire",
  "playerId": "123456789",
  "packageId": "ff100",
  "paymentMethod": "khqr"
}
```

POST `/api/orders/:id/pay` (DEMO ONLY)

GET `/api/orders/:id`

GET `/api/admin/orders`

## 5. Branding

Edit the text, colors and cards in:

- `public/index.html`
- `public/styles.css`

The design uses CSS gradients and icons, so it does not depend on copyrighted game artwork.
