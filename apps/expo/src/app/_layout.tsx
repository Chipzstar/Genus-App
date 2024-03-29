import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/trpc";

import "../styles.css";

import Constants from "expo-constants";
import { ClerkProvider } from "@clerk/clerk-expo";
import { useColorScheme } from "nativewind";

import { tokenCache } from "~/utils/cache";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
	const { colorScheme } = useColorScheme();
	return (
		<ClerkProvider publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
			<TRPCProvider>
				{/*
          The Stack component displays the current page.
          It also allows you to configure your screens
        */}
				<Stack
					screenOptions={{
						headerStyle: {
							backgroundColor: "#2AA6B7"
						},
						contentStyle: {
							backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF"
						}
					}}
				/>
				<StatusBar />
			</TRPCProvider>
		</ClerkProvider>
	);
}
