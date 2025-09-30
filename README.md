# WIBU Client

This is the frontend for the "What I Bought You" application. It is built with React, TypeScript, and Vite.

## Prerequisites

- Node.js (v20.x or later)
- npm

## Getting Started

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Set Up Environment Variables:**

    Create a `.env` file in the root of the `wibu_client` directory. This is required for Stripe integration. Add the following variable:

    ```
    # Your Stripe Publishable Key for testing
    VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
    ```

3.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

    The server will start on `http://localhost:5173` (or another port if 5173 is in use).

## API Proxy

This project is configured to proxy API requests from `/api` to the backend server running at `http://localhost:8080`. This is handled by the `vite.config.ts` file.

## Testing

To run the automated tests, use:

```bash
npm test
```