import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const clerkAuth = ClerkExpressRequireAuth();

export function requireAuth(req, res, next) {
  clerkAuth(req, res, (err) => {
    if (err) {
      console.warn("Clerk authentication failed:", err.message || err);
      return res.status(401).json({ message: "Unauthenticated request" });
    }
    next();
  });
}
