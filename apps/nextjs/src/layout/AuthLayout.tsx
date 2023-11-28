import React from 'react';

interface Props {
    children: React.ReactNode
}

const AuthLayout = ({children}: Props) => {
    return (
        <main className='min-h-screen m-auto text-white via-primary bg-gradient-to-r from-teal-500 to-purple-300 md:px-4 p-6 md:py-8'>
            {children}
        </main>
    );
};

export default AuthLayout;
