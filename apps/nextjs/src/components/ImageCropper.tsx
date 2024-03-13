/* eslint-disable @next/next/no-img-element */
"use client";

import "react-image-crop/dist/ReactCrop.css";

import { FC, useRef, useState } from "react";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@nextui-org/react";
import type { Crop, PixelCrop } from "react-image-crop";
import ReactCrop from "react-image-crop";
import { toast } from "sonner";

import { Button } from "@genus/ui/button";

export type ImageCropperProps = {
	src?: string;
	file: File[];
	addImage: (files: File[]) => void;
	onClose: () => void;
};

export const ImageCropper: FC<ImageCropperProps> = props => {
	const [loading, setLoading] = useState(false);
	const { isOpen, onOpen, onOpenChange } = useDisclosure({
		isOpen: !!props.src,
		onClose: props.onClose,
		defaultOpen: !!props.src
	});
	const [crop, setCrop] = useState<Crop>();
	const [storedCrop, setStoredCrop] = useState<PixelCrop>();
	const imageRef = useRef<HTMLImageElement>(null);

	const uploadImage = async () => {
		setLoading(true);
		if (!imageRef.current || !storedCrop) {
			setLoading(false);
			toast.warning("Image not cropped", {
				description: "Use the crop window to crop your image before uploading",
				duration: 3000
			});
			return;
		}
		const blob = await createBlobFromImage(imageRef, storedCrop);
		const metadata = props.file[0];

		const file = createFileFromBlob(blob, metadata!);
		props.addImage([file]);
		setStoredCrop(undefined);
		setLoading(false);
		props.onClose();
	};

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
							<Button
								loading={loading}
								variant="secondary"
								size="sm"
								className="w-2/5"
								onClick={() => void uploadImage()}
							>
								Upload
							</Button>
						</div>
					</div>
				)}
			</ModalContent>
		</Modal>
	);
};

const createBlobFromImage = (imageRef: React.RefObject<HTMLImageElement>, storedCrop: PixelCrop): Promise<Blob> => {
	return new Promise<Blob>((res, rej) => {
		const canvas = cropImage(imageRef.current!, storedCrop);
		canvas.toBlob(blob => {
			blob ? res(blob) : rej("No blob");
		});
	});
};

const createFileFromBlob = (blob: Blob, metadata: File): File => {
	return new File([blob], metadata.name, { type: metadata.type });
};

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
