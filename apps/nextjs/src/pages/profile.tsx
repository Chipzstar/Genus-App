"use client"

import {SignedIn, UserProfile, useClerk} from "@clerk/nextjs";
import {Navbar, NavbarBrand} from "@nextui-org/react";
import React, {ReactElement} from "react";
import AppLayout from "~/layout/AppLayout";
import {Button} from "@genus/ui/button";
import Image from 'next/image';
import { useRouter } from "next/router";
import {PATHS} from "~/utils";

const UserProfilePage = () => {
    const router = useRouter()
    const {signOut} = useClerk();
    return (
        <div className='min-h-screen max-w-4xl mx-auto text-primary py-6 md:pb-12'>
            <Navbar classNames={{
                brand: 'w-full flex justify-center items-center',
            }}>
                <NavbarBrand role="button" onClick={() => router.push(PATHS.HOME)}>
                    <Image src='/images/logo-white.svg' alt='genus-white' width={100} height={75}/>
                    <div className='absolute right-4'>
                        <SignedIn>
                            <Button size="sm" onClick={(e) => signOut()}>Logout</Button>
                        </SignedIn>
                    </div>
                </NavbarBrand>
            </Navbar>
            <div className="flex relative">
                <UserProfile path="/profile" routing="hash"/>
            </div>
        </div>
    );
}


UserProfilePage.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>{page}</AppLayout>
    )
}
export default UserProfilePage;
