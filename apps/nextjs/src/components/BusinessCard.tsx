import type { FC } from "react";
import React from "react";
import { useRouter } from "next/router";
import { Image, Tooltip } from "@nextui-org/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import { toast } from "sonner";

import { PATHS } from "~/utils";
import type { RouterOutputs } from "~/utils/trpc";
import { trpc } from "~/utils/trpc";

export const BusinessCard: FC<{
	business: RouterOutputs["business"]["all"][number];
	editable?: boolean;
}> = props => {
	const { name, logoUrl, tags, slug } = props.business;
	const utils = trpc.useUtils();
	const { mutate: toggleVisibility } = trpc.business.updateBusinessVisibility.useMutation({
		onSuccess(data) {
			console.log(data);
			toast.success(`${data.name} is now ${data.isPublic ? "visible" : "hidden"}`);
			void utils.business.invalidate();
		}
	});
	const router = useRouter();
	return (
		<div className="relative w-36 sm:h-40 sm:w-40">
			{props.editable && (
				<Tooltip
					showArrow={true}
					content={props.business.isPublic ? "Hide" : "Unhide"}
					className="w-full overflow-hidden text-ellipsis"
				>
					<div
						className="-sm:-right-1 absolute -right-4 -top-1 z-20 sm:-top-1"
						role="button"
						onClick={() => toggleVisibility({ slug: props.business.slug })}
					>
						{props.business.isPublic ? (
							<EyeFilledIcon color="#2AA6B7" fontSize={25} />
						) : (
							<EyeSlashFilledIcon color="#2AA6B7" fontSize={25} />
						)}
					</div>
				</Tooltip>
			)}
			<div
				onClick={() => router.push(`${PATHS.BUSINESS}/${slug}`)}
				role="button"
				className="relative h-36 w-36 overflow-clip"
				style={{
					borderRadius: "35px"
				}}
			>
				<Image src={logoUrl ?? "/images/logo.png"} width="100%" height="100%" />
				<div
					className="absolute bottom-0 z-10 flex h-14 w-full flex-col bg-gray-400/50 px-3 pt-2 text-white"
					style={{
						borderRadius: "0 0 35px 35px"
					}}
				>
					<span className="truncate text-ellipsis">{name}</span>
					<div className="flex truncate text-wrap">
						{tags.map((tag, index) => (
							<span
								key={index}
								className="inline-block rounded-full text-xs font-semibold tracking-tight"
							>
								#{tag}&nbsp;
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
