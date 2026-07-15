# CrowdPulse - Crowdfunding Platform

**Live Site:** [https://crowdpulse.vercel.app](https://crowdpulse.vercel.app)

## Admin Credentials

- **Email:** admin@crowdpulse.com
- **Password:** Admin@123

## Features

1. **Role-Based Authentication** — Three distinct roles (Supporter, Creator, Admin) with JWT-based secure authentication and Google Sign-In via Firebase.

2. **Campaign Management** — Creators can launch, update, and delete campaigns with image uploads via imgBB. Campaigns go through an admin approval process before becoming visible.

3. **Contribution System** — Supporters browse approved campaigns, contribute platform credits, and track their contribution history with real-time status updates.

4. **Credit Purchase System** — Stripe-integrated payment system for purchasing credits with 4 tiered packages (100, 300, 800, 1500 credits).

5. **Withdrawal System** — Creators can withdraw raised funds at a rate of 20 credits = $1, with admin approval and automatic credit deduction.

6. **Admin Dashboard** — Full platform oversight with campaign approvals, user management, withdrawal processing, and report handling.

7. **Notification System** — Real-time notifications for contribution approvals/rejections, campaign status changes, and withdrawal updates.

8. **Responsive Design** — Fully responsive across mobile, tablet, and desktop devices with a clean, modern UI built with Tailwind CSS.

9. **Animated Homepage** — Hero slider with Swiper.js, animated sections with Framer Motion, testimonial slider, platform stats, and "How It Works" section.

10. **Report System** — Supporters can report suspicious or fraudulent campaigns, with admin review and action capabilities.

11. **Pagination** — Implemented on My Contributions page and campaign listings for efficient data loading.

12. **Image Upload with imgBB** — Integrated image uploading for campaign covers and profile pictures.

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- Framer Motion (animations)
- Swiper.js (sliders)
- Firebase Auth (Google Sign-In)
- Stripe.js (payments)
- React Hot Toast (notifications)

### Backend
- Node.js
- Express.js
- MongoDB Atlas (Mongoose ODM)
- JWT (authentication)
- bcryptjs (password hashing)
- Stripe (payment processing)

## Project Structure

```
crowdfund-hub/
├── client/          # Next.js frontend
│   └── src/
│       ├── app/     # Pages (App Router)
│       ├── components/
│       ├── providers/
│       └── utils/
└── server/          # Express.js backend
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    └── routes/
```

## Setup Instructions

### Server
```bash
cd server
npm install
# Configure .env with MongoDB URI and keys
node seedAdmin.js   # Create admin user
npm run dev         # Start development server on port 5000
```

### Client
```bash
cd client
npm install
# Configure .env.local with API URL and Firebase keys
npm run dev         # Start development server on port 3000
```

## Environment Variables

### Server (.env)
- `PORT` — Server port (default: 5000)
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Secret key for JWT tokens
- `STRIPE_SECRET_KEY` — Stripe secret key
- `CLIENT_URL` — Frontend URL for CORS

### Client (.env.local)
- `NEXT_PUBLIC_API_URL` — Backend API URL
- `NEXT_PUBLIC_FIREBASE_*` — Firebase configuration
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `NEXT_PUBLIC_IMGBB_API_KEY` — imgBB API key for image uploads
