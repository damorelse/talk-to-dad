import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { EmergencyBar } from './EmergencyBar.js';
import { NavigationBar } from './NavigationBar.js';
export const MainContainer = ({ activeTab, onTabChange, children, }) => {
    return (_jsxs("div", { className: "w-full h-full h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 select-none transition-colors duration-200", children: [_jsx(EmergencyBar, {}), _jsx("main", { className: "flex-1 w-full overflow-hidden flex flex-col relative px-2 sm:px-3 pt-1 pb-2 sm:pb-3", children: children }), _jsx(NavigationBar, { activeTab: activeTab, onTabChange: onTabChange })] }));
};
