import type { FC } from "react";
import React from "react";
import type { Control } from "react-hook-form";
import type * as z from "zod";

import { Checkbox } from "@genus/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@genus/ui/form";
import { Input } from "@genus/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@genus/ui/select";
import type { profileSchema } from "@genus/validators";
import { genders, hobbies, role_sectors } from "@genus/validators/constants";

import { formatString } from "~/utils";

type FormValues = z.infer<typeof profileSchema>;

interface Props {
	control: Control<FormValues>;
}

export const EditProfile: FC<Props> = ({ control }) => {
	return (
		<div className="flex flex-col px-6 py-8 lg:p-8">
			<section className="grid gap-x-4 gap-y-4 sm:gap-x-12 md:grid-cols-2">
				<FormField
					control={control}
					name="firstname"
					render={({ field }) => (
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input className="bg-background text-black" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="lastname"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last Name</FormLabel>
							<FormControl>
								<Input className="bg-background text-black" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="gender"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Gender</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger className="rounded-xl bg-background text-black">
										<SelectValue placeholder="Select your gender" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{genders.map(gender => (
										<SelectItem key={gender} value={gender}>
											{formatString(gender)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="age"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Age</FormLabel>
							<FormControl>
								<Input
									defaultValue={field.value}
									placeholder="Please enter your age"
									{...field}
									type="number"
									className="rounded-xl bg-background text-black"
									onPaste={e => {
										e.preventDefault();
										return false;
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="md:col-span-2">
					<FormField
						control={control}
						name="role_sector"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Role</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger className="rounded-xl bg-background text-black">
											<SelectValue placeholder="Select your role" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{role_sectors?.map((role, index) => {
											if (role)
												return (
													<SelectItem key={index} value={role}>
														{formatString(role)}
													</SelectItem>
												);
										})}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="order-last col-span-2 row-span-2 md:order-none">
					<FormField
						control={control}
						name="hobbies_interests"
						render={() => (
							<FormItem>
								<FormLabel>Hobby interests</FormLabel>
								<FormDescription className="text-neutral-600">Select all that apply</FormDescription>
								<div className="grid grid-cols-3 flex-row flex-wrap items-center space-y-2 lg:grid-cols-4">
									{hobbies.map((item, index) => (
										<FormField
											key={index}
											control={control}
											name="hobbies_interests"
											render={({ field }) => {
												return (
													<FormItem
														key={index}
														className="flex flex-row items-start space-x-3 space-y-0"
													>
														<FormControl>
															<Checkbox
																className="bg-background"
																checked={field.value?.includes(item)}
																onCheckedChange={(checked: boolean) => {
																	return checked
																		? field.onChange([...field.value, item])
																		: field.onChange(
																				field.value?.filter(
																					value => value !== item
																				)
																			);
																}}
															/>
														</FormControl>
														<FormLabel className="truncate whitespace-nowrap font-normal">
															{formatString(item)}
														</FormLabel>
													</FormItem>
												);
											}}
										/>
									))}
								</div>
								<FormMessage className="text-red-500/75" />
							</FormItem>
						)}
					/>
				</div>
			</section>
		</div>
	);
};
