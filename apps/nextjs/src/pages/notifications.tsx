import React, {ReactElement} from 'react';
import {PATHS} from "~/utils";
import {Button} from "@genus/ui/button";
import AppLayout from "~/layout/AppLayout";
import { Navbar, NavbarBrand } from '@nextui-org/react';
import { useRouter } from 'next/router';
import {SignedIn, useAuth } from '@clerk/nextjs';
import Image from 'next/image';

const Notifications = () => {
    const router = useRouter()
    const { signOut } = useAuth();
    return (
        <div className='page-container'>
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
            <div className='bg-white h-full p-6 sm:px-12 sm:pt-12'>
            </div>
        </div>
    );
};

Notifications.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>{page}</AppLayout>
    )
}

export default Notifications;
