import { cx } from 'class-variance-authority';
import React from 'react';
import BottomNav from "~/components/BottomNav";
import {fontSans} from "~/layout/Layout";
import {useRouter} from 'next/router';

interface Props {
    children: React.ReactNode
}

const AppLayout = ({children}: Props) => {
    const router = useRouter()
    return (
        <main className={cx('min-h-screen m-auto text-white bg-primary', fontSans.className)}>
            {children}
            <BottomNav activePage={router.pathname}/>
        </main>
    );
};

export default AppLayout;
