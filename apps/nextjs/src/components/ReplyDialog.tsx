import Image from "next/image";
import { useSession } from "@clerk/nextjs";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { Reply } from "lucide-react";
import pluralize from "pluralize";

import { cn } from "@genus/ui";
import { Separator } from "@genus/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@genus/ui/sheet";

import { ChatBubble } from "~/components/ChatBubble";
import EmojiDialog from "~/components/EmojiDialog";
import { formatTimestamp } from "~/utils";
import { trpc } from "~/utils/trpc";
import { Message } from "~/utils/types";
import ChatInput from "./ChatInput";

interface DialogProps {
	message: Message;
	isMember: boolean;
}

const ReplyDialog = ({ message, isMember }: DialogProps) => {
	const { session } = useSession();
	const { data: thread } = trpc.thread.getThreadById.useQuery(
		{
			id: message?.thread?.id ?? -1
		},
		{
			enabled: Boolean(message?.thread)
		}
	);
	const currentMessageAuthor = message.authorId === session?.user.id;
	return (
		<Sheet key={message.id}>
			<SheetTrigger key={message.id}>
				<span className="text-xs">
					{thread?.comments.length ? (
						<span className="hover:underline">
							{thread.comments.length} {pluralize("reply", thread.comments.length)}
						</span>
					) : (
						<Reply strokeWidth={1.5} className="mb-0.5" size={20} />
					)}
				</span>
			</SheetTrigger>
			<SheetContent className="w-screen sm:w-[540px]" onKeyDown={e => e.key === "Escape"}>
				<SheetHeader>
					<SheetTitle>
						Thread <span className="text-sm font-normal text-gray-500">{message.author.firstname}</span>
					</SheetTitle>
					<Separator className="my-6" />
					<SheetDescription className="text-start">
						<div className={cn("flex flex-col space-y-2 sm:max-w-xs")}>
							<ChatBubble
								currentUser={currentMessageAuthor}
								member={isMember}
								hasNextMessageFromSameUser={false}
								message={{ ...message, status: "message" }}
							/>
							<div
								className={cn("flex items-center", {
									"justify-end": currentMessageAuthor
								})}
							>
								<div
									className={cn("mt-1 text-xs text-gray-400", {
										"text-gray-400/50": !isMember,
										"order-1 mr-1": currentMessageAuthor,
										"order-2 ml-1": !currentMessageAuthor
									})}
								>
									{formatTimestamp(message.createdAt, "distance")}
								</div>
								<div
									className={cn("relative h-6 w-6", {
										"order-2": currentMessageAuthor,
										"order-1": !currentMessageAuthor
									})}
								>
									<Image
										fill
										src={
											currentMessageAuthor
												? session.user.imageUrl
												: message.author.imageUrl
													? message.author.imageUrl
													: "/images/avatar-placeholder.png"
										}
										alt="Profile picture"
										referrerPolicy="no-referrer"
										className="rounded-full"
									/>
								</div>
							</div>
							{thread?.comments.length && (
								<div>
									<span className="flex flex-nowrap items-center whitespace-nowrap text-xs font-normal leading-tight tracking-tight text-gray-500">
										{`${thread.comments.length} ${pluralize("reply", thread.comments.length)}`}
										<hr className="ml-2 w-full" />
									</span>
								</div>
							)}
							{thread?.comments && (
								<Listbox items={thread.comments} aria-label="Dynamic Actions">
									{c => {
										const isCurrentUser = !!session && c.authorId === session.user.id;
										return (
											<ListboxItem key={c.commentId}>
												<ChatBubble
													currentUser={isCurrentUser}
													member={isMember}
													hasNextMessageFromSameUser={false}
													message={{ ...c, status: "comment" }}
												/>
												<div className="mt-1.5 flex grow items-center">
													<div className={cn("relative h-6 w-6")}>
														<Image
															fill
															src={
																isCurrentUser && !c.isAnonymous
																	? session.user.imageUrl
																	: c.author.imageUrl && !c.isAnonymous
																		? c.author.imageUrl
																		: "/images/avatar-placeholder.png"
															}
															alt="Profile picture"
															referrerPolicy="no-referrer"
															className="rounded-full"
														/>
													</div>
													<span
														className={cn("ml-1 text-xs text-gray-400", {
															"text-gray-400/50": !isMember
														})}
													>
														{formatTimestamp(c.createdAt, "distance")}
													</span>
													<EmojiDialog
														status="comment"
														isCurrentUser={isCurrentUser}
														message={c}
													/>
												</div>
											</ListboxItem>
										);
									}}
								</Listbox>
							)}
						</div>
						{thread?.threadId ? (
							<ChatInput
								type="reply"
								replyType="comment"
								chatId={thread.threadId}
								isMember={isMember}
								message={message}
							/>
						) : (
							<ChatInput type="reply" replyType="thread" isMember={isMember} message={message} />
						)}
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
};

export default ReplyDialog;
