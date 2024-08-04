import * as React from "react";
import type { FC, SVGProps } from "react";

import type { IconProps } from "./types";

const ChurchIcon: FC<IconProps> = ({ size, active, ...props }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		stroke={active ? "#2AA6B7" : "#757882"}
		width={size}
		height={size}
		fill="none"
		{...props}
	>
		<path fill="url(#a)" d="M0 0h30v30H0z" />
		<defs>
			<pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
				<use xlinkHref="#b" transform="scale(.01111)" />
			</pattern>
			<image
				xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB+UlEQVR4nO2ZvU4CQRSFBwu18PVuTXVvQbLPQKuVJPb4DhaEJ9IHMIZyzBJIjImBFeb+zfkSGrLZPefLsszsLQUAAAAAAAAAAAAAAABABIZhuBORJ2b+EJF3Zn4cv7POlQoiumXmNxGpvz7b+Xx+b50vu+QK2XqSK2TrSa6QrSe5Qrae5ArZ05ZwmxMiN+ccg6XfZXfyfjk35di/rtcl9A9xkK0g+Qhknwld4REA2QqSj0C2ohjCH6SeEMhWFNG9bFL8aXcrmwyKdyfbsjD1IttDUXKQoSmeCpKjLCZv4YYJw9VLh7MtMvW0Gdl2uakx2vFtu5JtuK2u3cg2lly7kO1Eck0t25nkmlJ2wyXc5tQ5ra6rvvSzfp9MPbzPtryThx/n9JKjGSLy4qXcYCd7VVqyXC5vROTLg2RL2cz8WUqZlcaid14kG8rejS5KS0Tk1ZNki3My87q0ZrFYPBxk78afEDM/WwtRkL0aux46r0cHRZHJz6hB4V+94TVmTZ/L14IwnM0l2e0GpDUYzirg4a4iBxma4qkgOcqSvhg5zJS2EDnOlq4IBciYpgAFyho+OEXLHC5wxOxhgkbu4D5ghi5ug2Xq5GqAmbnbtYez3kg5nPVKquGsd1IMZ6MQejgbjZDD2eDEGM4CAAAAAAAAAAAAAAAAAKA05xvWDZMXSN/HXQAAAABJRU5ErkJggg=="
				id="b"
				width={90}
				height={90}
			/>
		</defs>
	</svg>
);
export { ChurchIcon };
