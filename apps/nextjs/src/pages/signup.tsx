import type { ReactElement } from "react";
import React from "react";

import type { StepItem } from "@genus/ui/stepper";
import { Step, Stepper } from "@genus/ui/stepper";

import Step1 from "~/containers/signup/Step1";
import Step2 from "~/containers/signup/Step2";
import Step3 from "~/containers/signup/Step3";
import AuthLayout from "../layout/AuthLayout";
import type { NextPageWithAuthLayout } from "./_app";

const Signup: NextPageWithAuthLayout = () => {
	const steps = [{ label: "Step 1" }, { label: "Step 2" }] satisfies StepItem[];

	return (
		<div className="flex grow flex-col items-center sm:gap-y-8">
			<Stepper
				onClickStep={(step, setStep) => setStep(step)}
				initialStep={0}
				steps={steps}
				styles={{
					"main-container": "max-w-3xl"
				}}
			>
				<Step>
					<Step1 />
				</Step>
				<Step>
					<Step2 />
				</Step>
				<Step>
					<Step3 />
				</Step>
			</Stepper>
		</div>
	);
};

Signup.getLayout = function getLayout(page: ReactElement) {
	return <AuthLayout>{page}</AuthLayout>;
};

export default Signup;
