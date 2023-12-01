import { cx } from 'class-variance-authority';
import {Bell, Home, Search, Users, User2 } from 'lucide-react';
import React from 'react';
import {PATHS} from "~/utils";


interface Props {
    activePage: string;
}
const BottomNav = ({activePage=PATHS.HOME} : Props) => {
    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-primary border-t border-gray-2000">
            <div className="grid h-full max-w-2xl grid-cols-5 mx-auto font-medium text-gray-500">
                <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-primary-50 dark:hover:bg-gray-800 group">
                    <Home color={activePage === PATHS.HOME ? "white" : "gray"} size={25}strokeWidth={1.5}/>
                    <span className={cx(activePage === PATHS.HOME && 'text-white group-hover:text-white', "text-xs sm:text-sm group-hover:text-blue-600")}>Home</span>
                </button>
                <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-primary-50 dark:hover:bg-gray-800 group">
                    <Users color={activePage === PATHS.GROUPS ? "white" : "gray"} size={25}strokeWidth={1.5}/>
                    <span className={cx(activePage === PATHS.GROUPS && 'text-white group-hover:text-white', "text-xs sm:text-sm group-hover:text-blue-600")}>Groups</span>
                </button>
                <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-primary-50 dark:hover:bg-gray-800 group">
                    <Search color={activePage === PATHS.INSIGHTS ? "white" : "gray"} size={25} strokeWidth={1.5}/>
                    <span className={cx(activePage === PATHS.INSIGHTS && 'text-white group-hover:text-white', "text-xs sm:text-sm group-hover:text-blue-600")}>Insights</span>
                </button>
                <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-primary-50 dark:hover:bg-gray-800 group">
                    <Bell color={activePage === PATHS.NOTIFICATIONS ? "white" : "gray"} size={25} strokeWidth={1.5}/>
                    <span className={cx(activePage === PATHS.NOTIFICATIONS && 'text-white group-hover:text-white', "text-xs sm:text-sm group-hover:text-blue-600")}>Notifications</span>
                </button>
                <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-primary-50 dark:hover:bg-gray-800 group">
                    <User2 color={activePage === PATHS.PROFILE ? "white" : "gray"} size={25} strokeWidth={1.5}/>
                    <span className={cx(activePage === PATHS.PROFILE && 'text-white group-hover:text-white', "text-xs sm:text-sm group-hover:text-blue-600")}>Profile</span>
                </button>
            </div>
        </div>
    );
};

export default BottomNav;
