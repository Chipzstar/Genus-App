import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";

import { Button } from "@genus/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@genus/ui/dialog";
import { Form, FormField } from "@genus/ui/form";

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
	onSubmit: (code: CodeFormValues) => void;
	loading: boolean;
}

const CodeInput = ({ onSubmit, opened, setOpen, loading }: Props) => {
	const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>, form: UseFormReturn<CodeFormValues>) => {
		event.preventDefault();
		let copyValue = event.clipboardData.getData("Text").trim();
		if (copyValue.length !== 6) {
			copyValue = copyValue.slice(0, 6);
		}
		form.setValue("code1", copyValue.charAt(0));
		form.setValue("code2", copyValue.charAt(1));
		form.setValue("code3", copyValue.charAt(2));
		form.setValue("code4", copyValue.charAt(3));
		form.setValue("code5", copyValue.charAt(4));
		form.setValue("code6", copyValue.charAt(5));
	};

	const form = useForm<CodeFormValues>({
		defaultValues: {
			code1: undefined,
			code2: undefined,
			code3: undefined,
			code4: undefined,
			code5: undefined,
			code6: undefined
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
							{formValueKeys.map((name, index) => {
								const current = index + 1;
								const currentId = `code-${current}`;
								const prevId = `code-${current - 1}`;
								const nextId = `code-${current + 1}`;
								return (
									<FormField
										key={index}
										control={form.control}
										name={name as KeyUnion}
										render={({ field }) => (
											<div key={currentId}>
												<label htmlFor={currentId} className="sr-only">
													Code {index + 1}
												</label>
												<input
													{...field}
													type="number"
													max={9}
													min={0}
													maxLength={1}
													onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) =>
														focusNextInput(event, prevId, nextId)
													}
													id={currentId}
													className="number-input block h-9 w-9 rounded-lg border border-gray-300 bg-white py-3 text-center text-sm font-extrabold text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
													onPaste={event => handlePaste(event, form)}
													required
												/>
											</div>
										)}
									/>
								);
							})}
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
