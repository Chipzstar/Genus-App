import React from 'react';
import {Button} from "@genus/ui/button";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@genus/ui/dialog";
import {Form, FormField} from "@genus/ui/form";
import {useForm} from 'react-hook-form';

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

export type CodeFormValues = {
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
    onSubmit: (code: CodeFormValues) => void
}

const CodeInput = ({onSubmit, opened, setOpen}: Props) => {
    const form = useForm<CodeFormValues>({
        defaultValues: {
            code1: '',
            code2: '',
            code3: '',
            code4: '',
            code5: '',
            code6: ''
        }
    })

    return <Dialog open={opened} onOpenChange={setOpen}>
        <Form {...form}>
            <form id="code-form" onSubmit={form.handleSubmit(onSubmit)}>
                <DialogContent className="max-w-sm sm:max-w-md p-8">
                    <DialogHeader>
                        <DialogTitle>Verify Email</DialogTitle>
                        <DialogDescription>
                            Enter Verification Code
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex mb-2 space-x-2 rtl:space-x-reverse">
                        {formValueKeys.map((name, index) => {
                            let current = index + 1
                            const currentId = `code-${current}`;
                            const prevId = `code-${current - 1}`;
                            const nextId = `code-${current + 1}`;
                            return <FormField
                                control={form.control}
                                name={name as KeyUnion}
                                render={({field}) => (
                                    <div key={currentId}>
                                        <label htmlFor={currentId} className="sr-only">Code {index + 1}</label>
                                        <input
                                            {...field}
                                            type="number"
                                            maxLength={1}
                                            onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => focusNextInput(event, prevId, nextId)}
                                            id={currentId}
                                            className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 number-input"
                                            required
                                        />
                                    </div>
                                )}
                            />;
                        })}
                    </div>
                    <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Please enter the 4 digit code we sent via email.
                    </p>
                    <DialogFooter className="sm:justify-end">
                        <Button type="submit" variant="secondary" form="code-form">
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Form>
    </Dialog>
};

export default CodeInput;
