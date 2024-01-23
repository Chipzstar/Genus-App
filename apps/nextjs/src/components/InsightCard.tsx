import React, {FC} from 'react';
import Image from 'next/image';

interface Props {
    id: number;
    title: string;
    image: string;
}

const InsightCard: FC<Props> = (props: Props) => {
    const {id, title, image} = props;
    return (
        <div className="flex items-center space-x-3 sm:space-x-6 sm:pb-6 text-black">
            <img src={image} alt={title} className="object-fit w-32 sm:w-40"/>
            <header className="w-32 grow sm:w-96">
                <span className="leading-tight sm:text-xl font-bold whitespace-pre-wrap">{title}</span>
            </header>
        </div>
    );
};

export default InsightCard;
