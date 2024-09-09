import type { ReactElement } from "react";
import React from "react";
import { useRouter } from "next/router";

import type { StepItem } from "@genus/ui/stepper";
import { Step, Stepper } from "@genus/ui/stepper";

import Step1 from "~/containers/signup/Step1";
import Step2 from "~/containers/signup/Step2";
import Step3 from "~/containers/signup/Step3";
import { env } from "~/env";
import AuthLayout from "../layout/AuthLayout";
import type { NextPageWithAuthLayout } from "./_app";

interface StepItems extends StepItem {
	component: React.FC;
}

const { NODE_ENV } = env;

const Signup: NextPageWithAuthLayout = () => {
	const router = useRouter();
	const [initialStep, _] = React.useState(Number(router.query?.step ?? 0));
	const steps = [
		{
			label: "Step 1",
			component: Step1
		},
		{
			label: "Step 2",
			component: Step2
		},
		{
			label: "Step 3",
			component: Step3
		}
	] satisfies StepItems[];

	return (
		<div className="md:h-container flex grow flex-col items-center sm:gap-y-8">
			<Stepper
				orientation="horizontal"
				onClickStep={(step, setStep) => (NODE_ENV === "development" ? setStep(step) : undefined)}
				initialStep={initialStep}
				steps={steps}
				styles={{
					"main-container": "max-w-3xl"
				}}
			>
				{steps.map(step => (
					<Step key={step.label}>
						<step.component />
					</Step>
				))}
			</Stepper>
		</div>
	);
};

Signup.getLayout = function getLayout(page: ReactElement) {
	return <AuthLayout>{page}</AuthLayout>;
};

export default Signup;
