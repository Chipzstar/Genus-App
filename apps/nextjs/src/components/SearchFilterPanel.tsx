import React from "react";
import type { z } from "zod";

import { cn } from "@genus/ui";
import { Input } from "@genus/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@genus/ui/select";
import { hobbiesInterestsSchema } from "@genus/validators";

import { formatString } from "~/utils";

interface Props<T = z.infer<typeof hobbiesInterestsSchema>> {
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	categories: T[] | readonly T[];
	classNames?: string;
	filterValues?: (key: string) => void;
}

const SearchFilterPanel = <T,>({ value, onChange, categories = [], classNames, filterValues }: Props<T>) => (
	<div className="flex items-center justify-between space-x-10 py-6">
		<div
			className={cn("flex sm:w-64", classNames, {
				"sm:w-full": !filterValues
			})}
		>
			<Input
				value={value}
				onChange={onChange}
				className="w-full rounded-3xl bg-neutral-100 font-semibold text-black placeholder:text-neutral-400"
				placeholder="Search"
			/>
		</div>
		{filterValues && (
			<div className="flex sm:w-64">
				<Select onValueChange={value => filterValues(value)}>
					<SelectTrigger className="rounded-3xl bg-neutral-100 font-semibold text-black">
						<SelectValue defaultValue="all" placeholder="Filter" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="all">All tags</SelectItem>
							{categories.map((item, index) => {
								const parsed = hobbiesInterestsSchema.safeParse(item);
								const formattedItem = parsed.success
									? formatString(parsed.data)
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
