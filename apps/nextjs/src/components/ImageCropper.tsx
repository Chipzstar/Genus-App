/* eslint-disable @next/next/no-img-element */
"use client";

import "react-image-crop/dist/ReactCrop.css";

import { useRef, useState } from "react";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@nextui-org/react";
import type { Crop, PixelCrop } from "react-image-crop";
import ReactCrop from "react-image-crop";

import { Button } from "@genus/ui/button";

export function ImageCropper(props: {
	src?: string;
	file: File[];
	addImage: (files: File[]) => void;
	onClose: () => void;
}) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure({
		isOpen: !!props.src,
		onClose: props.onClose,
		defaultOpen: !!props.src
	});
	const [crop, setCrop] = useState<Crop>();
	const [storedCrop, setStoredCrop] = useState<PixelCrop>();
	const imageRef = useRef<HTMLImageElement>(null);

	async function uploadImage() {
		if (!imageRef.current || !storedCrop) return;
		const canvas = cropImage(imageRef.current, storedCrop);

		const blob = await new Promise<Blob>((res, rej) => {
			canvas.toBlob(blob => {
				blob ? res(blob) : rej("No blob");
			});
		});
		const metadata = props.file[0]!;

		const file = new File([blob], metadata.name, { type: metadata.type });

		props.addImage([file]);
		props.onClose();
	}

	return (
		<Modal size="lg" isOpen={isOpen} placement="center" onOpenChange={onOpenChange} backdrop="blur">
			<ModalContent>
				{onClose => (
					<div className="space-y-3 text-center">
						<ModalBody>
							<ReactCrop
								aspect={1}
								crop={crop}
								onChange={(_, percent) => setCrop(percent)}
								onComplete={c => setStoredCrop(c)}
							>
								<img ref={imageRef} src={props.src} alt="Crop me" height={400} />
							</ReactCrop>
						</ModalBody>
						<div className="flex justify-center space-x-5">
							<Button variant="outline" size="sm" className="w-2/5" onClick={onClose}>
								Cancel
							</Button>
							<Button variant="secondary" size="sm" className="w-2/5" onClick={() => void uploadImage()}>
								Submit
							</Button>
						</div>
					</div>
				)}
			</ModalContent>
		</Modal>
	);
}

function cropImage(image: HTMLImageElement, crop: PixelCrop) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("No 2d context");

	const scaleX = image.naturalWidth / image.width;
	const scaleY = image.naturalHeight / image.height;
	const pixelRatio = window.devicePixelRatio;

	canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
	canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

	ctx.scale(pixelRatio, pixelRatio);
	ctx.imageSmoothingQuality = "high";

	const cropX = crop.x * scaleX;
	const cropY = crop.y * scaleY;

	const centerX = image.naturalWidth / 2;
	const centerY = image.naturalHeight / 2;

	ctx.save();

	ctx.translate(-cropX, -cropY);
	ctx.translate(centerX, centerY);
	ctx.translate(-centerX, -centerY);
	ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight);

	ctx.restore();

	return canvas;
}
