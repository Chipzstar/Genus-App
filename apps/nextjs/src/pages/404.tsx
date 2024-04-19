import React from "react";
import type { ReactElement } from "react";
import { useRouter } from "next/router";

import { Button } from "@genus/ui/button";

import AuthLayout from "~/layout/AuthLayout";
import { PATHS } from "~/utils";

const NotFound = () => {
	const router = useRouter();
	return (
		<div className="mx-auto flex h-screen max-w-screen-xl items-center justify-start px-4 text-white md:px-8">
			<div className="mx-auto max-w-lg space-y-8 text-center">
				<h3 className="text-xl font-semibold text-secondary sm:text-3xl">404 Error</h3>
				<p className="text-4xl font-semibold sm:text-5xl">Page not found</p>
				<p className="text-lg leading-normal sm:text-xl">
					Sorry, the page you are looking for could not be found or has been removed.
				</p>
				<div className="flex flex-wrap items-center justify-center gap-4">
					<Button
						onClick={router.back}
						className="block w-2/5 rounded-lg bg-secondary px-4 py-2 font-medium text-white duration-150 hover:bg-secondary-400 active:bg-indigo-700"
					>
						Go back
					</Button>
					<Button
						onClick={() => router.push(PATHS.HOME)}
						className="block rounded-lg px-4 py-2 font-medium text-gray-700 duration-150 active:bg-gray-100 sm:w-2/5"
					>
						Back to Homepage
					</Button>
				</div>
			</div>
		</div>
	);
};

NotFound.getLayout = function getLayout(page: ReactElement) {
	return <AuthLayout>{page}</AuthLayout>;
};

export default NotFound;
