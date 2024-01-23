import React, {ReactElement} from 'react';
import AppLayout from "~/layout/AppLayout";
import {formatString, INSIGHTS, PATHS} from "~/utils";
import {Button} from "@genus/ui/button";
import {Navbar, NavbarBrand} from '@nextui-org/react';
import Image from 'next/image';
import {SignedIn, useAuth} from '@clerk/nextjs';
import {useRouter} from 'next/router';
import {Input} from "@genus/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@genus/ui/select";
import { ScrollArea } from "@genus/ui/scroll-area";
import {career_interests} from "~/schemas";
import {
    Listbox,
    ListboxSection,
    ListboxItem
} from "@nextui-org/listbox";
import InsightCard from '~/components/InsightCard';

const Insights = () => {
    const router = useRouter()
    const {signOut} = useAuth();
    return (
        <div className='page-container bg-white overflow-y-hidden'>
            <Navbar classNames={{
                brand: 'w-full flex justify-center items-center',
            }}>
                <NavbarBrand role="button" onClick={() => router.push(PATHS.HOME)}>
                    <Image src='/images/green-logo.svg' alt='genus-white' width={100} height={75}/>
                    <div className='absolute right-4'>
                        <SignedIn>
                            <Button size="sm" onClick={(e) => signOut()}>Logout</Button>
                        </SignedIn>
                    </div>
                </NavbarBrand>
            </Navbar>
            <div className='h-full p-6 sm:px-12 sm:pt-12'>
                <header className='text-black text-2xl sm:text-4xl font-bold'>Industry Insights</header>
                <div className="flex py-6 items-center justify-between space-x-10">
                    <div className="flex sm:w-64">
                        <Input className="rounded-3xl text-black placeholder:text-neutral-400 bg-neutral-100 font-semibold w-full"
                               placeholder="Search"/>
                    </div>
                    <div className="flex sm:w-64">
                        <Select>
                            <SelectTrigger className="rounded-3xl bg-neutral-100 text-black font-semibold">
                                <SelectValue defaultValue="all" placeholder="All types"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">All types</SelectItem>
                                    {career_interests.map((item, index) => (
                                        <SelectItem key={index} value={item}>{formatString(item)}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <ScrollArea className={"h-[calc(100%-12rem)]"}>
                    <Listbox
                        aria-label="Actions"
                    >
                        {INSIGHTS.map((insight, index) => (
                            <ListboxItem key={index} className="px-0">
                                <InsightCard
                                    id={insight.id}
                                    title={insight.title}
                                    image={insight.image}
                                />
                            </ListboxItem>
                        ))}
                    </Listbox>
                </ScrollArea>
            </div>
        </div>
    );
};

Insights.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>{page}</AppLayout>
    )
}
export default Insights;
