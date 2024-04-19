import type { FC } from "react";
import React from "react";
import { Building2 } from "lucide-react";

import type { IconProps } from "./types";

export const CompanyIcon: FC<IconProps> = ({ size = 25, active }) => {
	return <Building2 size={size} color={active ? "#2AA6B7" : "#757882"} strokeWidth={1.5} />;
};
