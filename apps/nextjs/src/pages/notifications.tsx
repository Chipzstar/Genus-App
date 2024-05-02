import type { ReactElement } from "react";
import React from "react";
import type { GetServerSideProps } from "next/types";

import { Separator } from "@genus/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@genus/ui/tabs";

import NotificationList from "~/components/NotificationList";
import AppLayout from "~/layout/AppLayout";
import TopNav from "~/layout/TopNav";
import { getServerSidePropsHelper } from "~/server/serverPropsHelper";

export const getServerSideProps: GetServerSideProps = getServerSidePropsHelper;

const Notifications = () => {
	return (
		<div className="page-container">
			<TopNav />
			<div className="h-container bg-white p-6 sm:px-12 sm:pt-12">
				<div className="mx-auto max-w-3xl">
					<Tabs defaultValue="unread">
						<div className="flex items-center px-4 py-2">
							<h1 className="text-xl font-bold">Notifications</h1>
							<TabsList className="ml-auto">
								<TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">
									Unread
								</TabsTrigger>
								<TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">
									All
								</TabsTrigger>
							</TabsList>
						</div>
						<Separator className="mb-3" />
						<TabsContent value="unread" className="m-0">
							<NotificationList items={[]} />
						</TabsContent>
						<TabsContent value="all" className="m-0">
							<NotificationList items={[]} />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

Notifications.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default Notifications;
