import React from "react";
import type { z } from "zod";

import { cn } from "@genus/ui";
import { Input } from "@genus/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@genus/ui/select";
import { careerInterestsSchema } from "@genus/validators";

import { formatString } from "~/utils";

interface Props<T = z.infer<typeof careerInterestsSchema>> {
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	categories: T[] | readonly T[];
	classNames?: string;
	withFilter?: boolean;
}

const SearchFilterPanel = <T,>({ value, onChange, categories = [], classNames, withFilter = true }: Props<T>) => (
	<div className="flex items-center justify-between space-x-10 py-6">
		<div
			className={cn("flex sm:w-64", classNames, {
				"sm:w-full": !withFilter
			})}
		>
			<Input
				value={value}
				onChange={onChange}
				className="w-full rounded-3xl bg-neutral-100 font-semibold text-black placeholder:text-neutral-400"
				placeholder="Search"
			/>
		</div>
		{withFilter && (
			<div className="flex sm:w-64">
				<Select>
					<SelectTrigger className="rounded-3xl bg-neutral-100 font-semibold text-black">
						<SelectValue defaultValue="all" placeholder="Filter" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="all">All types</SelectItem>
							{categories.map((item, index) => {
								const parsed = careerInterestsSchema.safeParse(item);
								const formattedItem = parsed.success
									? formatString(parsed.data, "category")
									: formatString(String(item), "default");
								return (
									<SelectItem key={index} value={String(item)}>
										{formattedItem}
									</SelectItem>
								);
							})}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		)}
	</div>
);

export default SearchFilterPanel;
