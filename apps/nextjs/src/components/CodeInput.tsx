import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@genus/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@genus/ui/dialog";
import { Form, FormField } from "@genus/ui/form";
import { FakeDash, OTPInput, Slot } from "@genus/ui/otp-input";

import useCounter from "~/hooks/useCounter";

const INTERVAL = 60;
let counter: NodeJS.Timeout;

interface Props {
	opened: boolean;
	setOpen: (val: boolean) => void;
	onSubmit: (val: { code: string }) => void;
	onResend: () => void;
	loading: boolean;
}

const CodeInput = ({ onSubmit, opened, setOpen, loading, onResend }: Props) => {
	const { count, setCount, increment, decrement } = useCounter(INTERVAL);
	const [canResend, setResendState] = useState(false);

	const show = useCallback(() => {
		setResendState(true);
		setCount(INTERVAL);
		clearInterval(counter);
	}, []);

	useEffect(() => {
		const timeout = setTimeout(show, 1000 * INTERVAL);
		counter = setInterval(() => decrement(), 1000);
		return () => {
			clearTimeout(timeout);
			clearInterval(counter);
		};
	}, []);

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
										onComplete={() => form.handleSubmit(onSubmit)()}
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
						<p className="text-sm text-gray-600">
							Resend Code:{" "}
							<span
								role={canResend ? "button" : undefined}
								className="font-semibold underline"
								onClick={onResend}
							>
								{canResend ? "Re-send" : count}
							</span>
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
