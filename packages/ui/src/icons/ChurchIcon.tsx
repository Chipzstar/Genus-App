import * as React from "react";
import type { FC, SVGProps } from "react";

import type { IconProps } from "./types";

export const ChurchIcon: FC<IconProps> = ({ size = 19, active = false }) => {
	const svgColor = active ? "#2AA6B7" : "#757882";

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			width={size}
			height={size}
			stroke={svgColor}
			fill={active ? "#2AA6B7" : "none"}
		>
			<path fill="url(#a)" d="M0 0h27.408v27H0z" />
			<defs>
				<pattern
					id="a"
					width={1}
					height={1}
					patternContentUnits="objectBoundingBox"
					stroke={svgColor}
					fill={svgColor}
				>
					<use xlinkHref="#b" transform="matrix(.01095 0 0 .01111 .007 0)" />
				</pattern>
				<image
					xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAACiklEQVR4nO3cQWoUQRQG4FJEPYCgqAtv4B3chIAuZz0yU//fMmR0qS6kLyK48iIu1OAiuhE8gktJQGchFR5ECMPMqKG7XlX3/8ODrLpTX15e18wkFYKiKIqiKIqiKIqiKIoSptPpdQDPABySPCGZBlonJD+SfLpcLq9l/dHHGO+S/FIAQspZAD7b2rN18hiReQ47S2fbuPBeLP1rmQP6sICFJuf6kAP6uICFJs8yg96ht908DDT0Wq+gKeg+oo7OFEFniqAzRdCZIuhMEXSmCDpTBJ0pgh4r9NgqCJqCZgGdqI6mP55GB/1hNaMpaPeuozqa7lAaHfRH1IxmOaUXLBR08u5CdTS7hwDwi+TzxWJxy8q+JrnS6GC3yAD2N7wh9kLQ7AzauvbRpofVfD6/KWj2i2yZzWa3Bc1+xsX5AHgpaPaOvH/2gOxkRI1xH73aNS4sMcY9kj+7vO/YoFceyGODXnkh1wj9juQTAAcAPpU8k2uGfhtCuPTnum3bXgHwugbkqqCbprm3fu22bS/vwi4FuRpoAL8nk8nVTdffhl0ScjXQJFOM8cG2e6xjl4ZcFTTJbyRv/A27ROTaoNPZvzrvxG6a5n5pyDVCJ5Jf7f3ii3wvfe6ThwidLoLtiVwzdPofbG/k2qHTv2CXgDwE6LQLuxTkoUAn243Yx05ryA89dhdDh04AvpN8FWN8TPKNvZr0xh0kNAsvQVPQybsL1dH0h9PooD+qZjQF7d5xrL2jdRwbbY//Iwe0DhhkhgMG7dRZ719bOpf9eUTv0HYAqh2E6r1Y+tXRtg+WO48d7TtS7KOmae6EnLHOtlNnbV4N+QEJ4BjAexsX2TpZURRFURRFURRFURQllJ1T49HaUJM5bQMAAAAASUVORK5CYII="
					id="b"
					fill={svgColor}
					width={90}
					height={90}
				/>
			</defs>
		</svg>
	);
};
