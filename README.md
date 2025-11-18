# Learning Hub App

A comprehensive AI-powered learning platform that helps students generate quizzes, summarize texts, and learn better with personalized tools.

## Features

- MCQ Quiz Generator on any topic
- PDF Upload for instant quiz generation
- Text Summarization
- Interactive Help Support with AI Assistant
- Advanced Analytics Dashboard
- Dark/Light Mode Toggle
- Clerk Authentication

## Setup & Installation

1. Clone the repository
```bash
git clone <repository-url>
cd my-project
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following:
```
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server
```bash
npm run dev
```

## Clerk Authentication Setup

This project uses [Clerk](https://clerk.com/) for authentication. To set it up:

1. Create an account at [clerk.com](https://clerk.com/)
2. Create a new application in the Clerk dashboard
3. Get your publishable key from the Clerk dashboard
4. Add the key to your `.env` file
5. Configure your application instance with:
   - Enable Email/Password authentication
   - Configure OAuth providers (Google, GitHub, etc.)
   - Set up redirects in the Clerk dashboard

## Troubleshooting Clerk with React 19

If you encounter issues with Clerk in React 19, try the following:

1. Update to the latest Clerk version:
```bash
npm install @clerk/clerk-react@latest
```

2. Create an `.npmrc` file in the project root with:
```
legacy-peer-deps=true
strict-peer-dependencies=false
```

3. Clear your node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```

4. Check for multiple `ClerkProvider` instances:
   - Ensure you only have one `ClerkProvider` in your application
   - It should be at the top level (main.jsx or index.jsx)

5. Verify environment variables:
```bash
echo $VITE_CLERK_PUBLISHABLE_KEY
```

## Backend Connection

The project connects to a Node.js backend API. Ensure the backend server is running at http://localhost:5000 or update the VITE_API_URL in the .env file.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run lint` - Run ESLint to check for code quality issues
- `npm run preview` - Preview the production build locally

## License

MIT
