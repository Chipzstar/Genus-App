// serverPropsHelper.ts
import type { GetServerSideProps } from "next/types";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server"; // assuming these are the correct imports

export const getServerSidePropsHelper: GetServerSideProps = async ({ req }) => {
	const { userId } = getAuth(req);
	if (!userId) return { props: {} };
	return { props: { userId, ...buildClerkProps(req) } };
};
