import React from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { FlashList } from "@shopify/flash-list";
import type { inferProcedureOutput } from "@trpc/server";

import type { AppRouter } from "@genus/api";

import { api } from "~/utils/trpc";

const SignOut = () => {
	const { signOut } = useAuth();
	return (
		<View className="rounded-lg border-2 border-gray-500 p-4">
			<Button
				title="Sign Out"
				onPress={() => {
					void signOut();
				}}
			/>
		</View>
	);
};

const MessageCard: React.FC<{
	message: inferProcedureOutput<AppRouter["message"]["getMessages"]>[number];
}> = ({ message }) => {
	return (
		<View className="rounded-lg border-2 border-gray-500 p-4">
			<Text className="text-xl font-semibold text-[#cc66ff]">{message.authorId}</Text>
			<Text className="text-white">{message.content}</Text>
		</View>
	);
};

const CreateMessage: React.FC = () => {
	const utils = api.useContext();
	const { mutate } = api.message.createMessage.useMutation({
		async onSuccess() {
			await utils.group.getGroupBySlug.invalidate();
		}
	});

	const [content, onChangeContent] = React.useState("");

	return (
		<View className="flex flex-col border-t-2 border-gray-500 p-4">
			<TextInput
				editable={false}
				className="mb-2 rounded border-2 border-gray-500 p-2 text-white"
				value={"InternGen"}
				placeholder="Title"
			/>
			<TextInput
				className="mb-2 rounded border-2 border-gray-500 p-2 text-white"
				onChangeText={onChangeContent}
				placeholder="Content"
			/>
			<TouchableOpacity
				className="rounded bg-[#cc66ff] p-2"
				onPress={() => {
					mutate({
						groupId: "",
						content
					});
				}}
			>
				<Text className="font-semibold text-white">Publish post</Text>
			</TouchableOpacity>
		</View>
	);
};

export default function Index() {
	const { data } = api.message.getMessages.useQuery();
	const [showPost, setShowPost] = React.useState<string | null>(null);

	return (
		<SafeAreaView className="bg-[#2e026d] bg-gradient-to-b from-[#2e026d] to-[#15162c]">
			<Stack.Screen options={{ title: "Home Page" }} />
			<View className="h-full w-full p-4">
				<Text className="mx-auto pb-2 text-5xl font-bold text-white">
					Create <Text className="text-[#cc66ff]">T3</Text> Turbo
				</Text>

				<View className="py-2">
					{showPost ? (
						<Text className="text-white">
							<Text className="font-semibold">Selected group:</Text>
							{showPost}
						</Text>
					) : (
						<Text className="font-semibold italic text-white">Press on a post</Text>
					)}
				</View>

				<FlashList
					data={data}
					estimatedItemSize={20}
					ItemSeparatorComponent={() => <View className="h-2" />}
					renderItem={m => (
						<TouchableOpacity onPress={() => setShowPost(m.item.messageId)}>
							<MessageCard message={m.item} />
						</TouchableOpacity>
					)}
				/>

				<CreateMessage />
				<SignOut />
			</View>
		</SafeAreaView>
	);
}
