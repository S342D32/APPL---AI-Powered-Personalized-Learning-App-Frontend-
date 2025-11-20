# Frontend Setup

## Environment Variables

Copy `.env.example` to `.env` and fill in your actual values:

```bash
cp .env.example .env
```

Required environment variables:
- `VITE_API_BASE_URL`: Your backend API URL
- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key

## Installation

```bash
npm install
npm run dev
```