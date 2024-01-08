import Clerk from "@clerk/clerk-js";

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string;
const clerk = new Clerk(clerkPublishableKey);

export default clerk;
