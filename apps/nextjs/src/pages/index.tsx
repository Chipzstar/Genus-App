import React, {ReactElement} from 'react';
import AppLayout from "~/layout/AppLayout";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem
} from "@nextui-org/react";
import Image from 'next/image';
import {Button} from "@genus/ui/button";
import {SignedIn, useClerk, clerkClient} from '@clerk/nextjs';
import { useRouter } from 'next/router';
import {PATHS} from "~/utils";

const images = [
    {
        src: '/images/experts/Tobi.svg',
        alt: 'Tobi genus expert',
        desc: 'Tobi - Markets Analyst at Goldman Sachs',
        width: 150,
        height: 100
    },
    {
        src: '/images/experts/Joseph.svg',
        alt: 'Joseph genus expert',
        desc: 'Joseph - Investment Banking',
        width: 150,
        height: 100
    }
]

const Home = () => {
    const router = useRouter()
    const {signOut} = useClerk();
    return (
        <div className='min-h-screen sm:h-screen mx-auto max-w-3xl text-primary py-6 md:py-8'>
            <Navbar classNames={{
                brand: 'w-full flex justify-center items-center',
            }}>
                <NavbarBrand role="button" onClick={() => router.push(PATHS.HOME)}>
                    <Image src='/images/white-logo.svg' alt='genus-white' width={100} height={75}/>
                    <div className='absolute right-4'>
                    <SignedIn>
                        <Button size="sm" onClick={(e) => signOut()}>Logout</Button>
                    </SignedIn>
                    </div>
                </NavbarBrand>
            </Navbar>
            <div className='bg-white h-full p-6 sm:px-12 sm:pt-12'>
                <header className='text-3xl font-semibold'>Home: Finance & Banking</header>
                <section className='pt-12'>
                    <div className='flex flex-col space-y-4 justify-center' role="button" onClick={() => router.push(PATHS.GROUPS)}>
                        <header className='text-xl font-semibold'>JOIN the group!</header>
                        <Image src='/images/spring-weeks-ldn.svg' alt="Spring Weeks London" width={200} height={150}
                               objectFit=""/>
                        <span className='text-lg font-semibold'>Spring Weeks LDN...</span>
                    </div>
                </section>
                <section className='pt-12 pb-6'>
                    <div className='flex flex-col space-y-4 justify-center'>
                        <div className='flex justify-between items-center'>
                            <header className='text-xl font-semibold'>Industry insights</header>
                            <span role="button" className="text-sm font-semibold">See all</span>
                        </div>
                        <div className='flex items-center space-y-4 sm:space-y-0 sm:space-x-4'>
                            {images.map(({src, height, width, alt, desc}, index) => (
                                <div key={index} className="flex flex-col space-y-4 truncate sm:w-48">
                                    <Image
                                        src={src}
                                        alt={alt}
                                        width={width}
                                        height={height}
                                    />
                                    <span className='text-lg truncate font-semibold'>{desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

Home.getLayout = function getLayout(page: ReactElement) {
    return (
        <AppLayout>{page}</AppLayout>
    )
}

export default Home;
