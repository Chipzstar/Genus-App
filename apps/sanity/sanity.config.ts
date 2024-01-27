import { codeInput } from "@sanity/code-input";
import { colorInput } from "@sanity/color-input";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { vercelDeployTool } from "sanity-plugin-vercel-deploy";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schemas";

export default defineConfig({
	name: "default",
	title: "Genus",
	projectId: "xkbqszda",
	dataset: "production",
	plugins: [structureTool(), visionTool(), codeInput(), unsplashImageAsset(), colorInput(), vercelDeployTool()],
	schema: {
		types: schemaTypes
	}
});
