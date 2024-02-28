import React, { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

import { Button } from "@genus/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@genus/ui/dialog";
import { Form, FormField } from "@genus/ui/form";
import { FakeDash, OTPInput, Slot } from "@genus/ui/otp-input";

const focusNextInput = (el: React.KeyboardEvent<HTMLInputElement>, prevId: string, nextId: string) => {
	const targetInput = el.target as HTMLInputElement;
	if (targetInput.value.length === 0) {
		const prevInput = document.getElementById(prevId) as HTMLInputElement | null;
		if (prevInput) prevInput.focus();
		else console.error(`Element with id "${prevId}" not found`);
	} else {
		const nextInput = document.getElementById(nextId) as HTMLInputElement | null;
		if (nextInput) nextInput.focus();
		else console.error(`Element with id "${nextId}" not found`);
	}
};

export interface CodeFormValues {
	code1: string;
	code2: string;
	code3: string;
	code4: string;
	code5: string;
	code6: string;
}

type KeyUnion = keyof CodeFormValues;

const formValueKeys = Object.keys({
	code1: "",
	code2: "",
	code3: "",
	code4: "",
	code5: "",
	code6: ""
} as CodeFormValues);

interface Props {
	opened: boolean;
	setOpen: (val: boolean) => void;
	onSubmit: (val: { code: string }) => void;
	loading: boolean;
}

const CodeInput = ({ onSubmit, opened, setOpen, loading }: Props) => {
	const form = useForm<{ code: string }>({
		defaultValues: {
			code: ""
		}
	});

	return (
		<Dialog open={opened} onOpenChange={setOpen}>
			<Form {...form}>
				<form id="code-form" onSubmit={form.handleSubmit(onSubmit)}>
					<DialogContent className="max-w-sm p-8 sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Verify Email</DialogTitle>
							<DialogDescription>Enter Verification Code</DialogDescription>
						</DialogHeader>
						<div className="mb-2 flex space-x-2 rtl:space-x-reverse">
							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<OTPInput
										maxLength={6}
										value={field.value}
										onChange={field.onChange}
										onError={e =>
											form.setError("code", {
												message: "Invalid Code",
												type: "pattern"
											})
										}
										render={({ slots }) => (
											<>
												<div className="flex">
													{slots.slice(0, 3).map((slot, idx) => (
														<Slot key={idx} {...slot} />
													))}
												</div>

												<FakeDash />

												<div className="flex">
													{slots.slice(3).map((slot, idx) => (
														<Slot key={idx} {...slot} />
													))}
												</div>
											</>
										)}
									/>
								)}
							/>
						</div>
						<p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
							Please enter the 6 digit code we sent via email.
						</p>
						<DialogFooter className="sm:justify-end">
							<Button
								loading={loading}
								disabled={loading}
								type="submit"
								variant="secondary"
								form="code-form"
							>
								Submit
							</Button>
						</DialogFooter>
					</DialogContent>
				</form>
			</Form>
		</Dialog>
	);
};

export default CodeInput;
