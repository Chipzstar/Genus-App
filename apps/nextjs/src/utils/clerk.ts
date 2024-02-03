import Clerk from "@clerk/clerk-js";

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const clerk = new Clerk(clerkPublishableKey);

export default clerk;
