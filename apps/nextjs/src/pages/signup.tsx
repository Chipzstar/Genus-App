"use client";

import type { ReactElement } from "react";
import React from "react";

import type { StepItem } from "@genus/ui/stepper";
import { Step, Stepper } from "@genus/ui/stepper";

import Step1 from "~/containers/signup/Step1";
import Step2 from "~/containers/signup/Step2";
import AuthLayout from "../layout/AuthLayout";
import type { NextPageWithAuthLayout } from "./_app";

const MAX_STEPS = 4;

const Signup: NextPageWithAuthLayout = () => {
	const steps = [{ label: "Step 1" }, { label: "Step 2" }] satisfies StepItem[];

	return (
		<div className="flex min-h-screen grow flex-col items-center sm:gap-y-12 md:gap-12">
			<Stepper
				initialStep={0}
				steps={steps}
				styles={{
					"main-container": "max-w-3xl"
				}}
			>
				<Step key={1}>
					<Step1 maxSteps={MAX_STEPS} />
				</Step>
				<Step key={2}>
					<Step2 maxSteps={MAX_STEPS} />
				</Step>
			</Stepper>
		</div>
	);
};

Signup.getLayout = function getLayout(page: ReactElement) {
	return <AuthLayout>{page}</AuthLayout>;
};

export default Signup;
