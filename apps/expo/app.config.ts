import type { ConfigContext, ExpoConfig } from "@expo/config";

const CLERK_PUBLISHABLE_KEY = "pk_test_cnVsaW5nLWFsYmFjb3JlLTI4LmNsZXJrLmFjY291bnRzLmRldiQ";

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: "Genus Networks",
	slug: "genus-networks",
	scheme: "genus",
	version: "1.0.0",
	orientation: "portrait",
	icon: "./assets/icon.png",
	userInterfaceStyle: "automatic",
	splash: {
		image: "./assets/icon.png",
		resizeMode: "contain",
		backgroundColor: "#2AA6B7"
	},
	updates: {
		fallbackToCacheTimeout: 0
	},
	assetBundlePatterns: ["**/*"],
	ios: {
		supportsTablet: true,
		bundleIdentifier: "your.bundle.identifier"
	},
	android: {
		adaptiveIcon: {
			foregroundImage: "./assets/icon.png",
			backgroundColor: "#2AA6B7"
		}
	},
	web: {
		bundler: "metro"
	},
	extra: {
		eas: {
			projectId: "9c39ba02-e262-4a33-ab27-1af32f90e32e"
		},
		CLERK_PUBLISHABLE_KEY
	},
	experiments: {
		tsconfigPaths: true,
		typedRoutes: true
	},
	plugins: ["expo-router"]
});
