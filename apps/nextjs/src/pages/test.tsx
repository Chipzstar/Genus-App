import { Button } from "@genus/ui/button";
import type { StepItem } from "@genus/ui/stepper";
import { Step, Stepper, useStepper } from "@genus/ui/stepper";

const steps = [{ label: "Step 1" }, { label: "Step 2" }, { label: "Step 3" }] satisfies StepItem[];

const Test = () => (
	<div className="flex w-full flex-col gap-4">
		<Stepper initialStep={0} steps={steps}>
			{steps.map((stepProps, index) => {
				return (
					<Step key={stepProps.label} {...stepProps}>
						<div className="my-4 flex h-40 items-center justify-center rounded-md border bg-secondary text-primary">
							<h1 className="text-xl">Step {index + 1}</h1>
						</div>
					</Step>
				);
			})}
			<Footer />
		</Stepper>
	</div>
);

const Footer = () => {
	const { nextStep, prevStep, resetSteps, hasCompletedAllSteps, isLastStep, isOptionalStep, isDisabledStep } =
		useStepper();
	return (
		<>
			{hasCompletedAllSteps && (
				<div className="my-4 flex h-40 items-center justify-center rounded-md border bg-secondary text-primary">
					<h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
				</div>
			)}
			<div className="flex w-full justify-end gap-2">
				{hasCompletedAllSteps ? (
					<Button size="sm" onClick={resetSteps}>
						Reset
					</Button>
				) : (
					<>
						<Button disabled={isDisabledStep} onClick={prevStep} size="sm" variant="secondary">
							Prev
						</Button>
						<Button size="sm" onClick={nextStep}>
							{isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
						</Button>
					</>
				)}
			</div>
		</>
	);
};

export default Test;
