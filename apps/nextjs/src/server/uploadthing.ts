import type {NextApiRequest, NextApiResponse} from "next";
import { prisma } from "@genus/db";

import {createUploadthing, type FileRouter} from "uploadthing/next-legacy";
import {timeout} from "~/utils";
import { getAuth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();
const f = createUploadthing();

const mockAuth = async (req: NextApiRequest, res: NextApiResponse) => {
    await timeout(3000);
    return { id: 1 } // return fake user Id
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({image: {maxFileSize: "4MB", maxFileCount: 1}})
        // Set permissions and file types for this FileRoute
        .middleware(async ({req, res}) => {
            console.log(Object.keys(req))
            // This code runs on your server before upload
            const { userId } = getAuth(req);

            // If you throw, the user will not be able to upload
            if (!userId) throw new Error("This user has not yet been authenticated");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return {userId};
        })
        .onUploadError(async ({error}) => {
            console.log(error)
            throw error;
        })
        .onUploadComplete(async ({metadata, file}) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
            // update the user with the new image url + image key in the database
            const user = await prisma.user.update({
                where: {
                    clerkId: metadata.userId
                },
                data: {
                    imageKey: file.key,
                    imageUrl: file.url
                }
            })
            return {
                uploadedBy: metadata.userId,
                imageKey: file.key,
                imageUrl: file.url
            };
        })

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
