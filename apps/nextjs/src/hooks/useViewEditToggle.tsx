import { useState } from "react";

type ViewEdit = "view" | "edit";
type SetValue = (value: ViewEdit) => void;
type Toggle = () => void;

export function useViewEditToggle(defaultValue: ViewEdit = "view"): [ViewEdit, Toggle, SetValue] {
	const [value, setValue] = useState(defaultValue);

	const toggleValue = () => {
		setValue(currentValue => (currentValue === "view" ? "edit" : "view"));
	};

	return [value, toggleValue, setValue];
}
