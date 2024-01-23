import React, { FC } from 'react';
import Image from 'next/image';

interface Props {
    id: number;
    title: string;
    image: string;
}

const InsightCard : FC<Props> = (props: Props) => {
    const { id, title, image } = props;
    return (
        <div className="flex items-center space-x-3 pb-6 text-black">
            <Image src={image} alt={title} width={150} height={100}/>
            <header className="sm:w-96">
                <span className="text-sm sm:text-2xl font-bold whitespace-pre-wrap">{title}</span>
            </header>
        </div>
    );
};

export default InsightCard;
