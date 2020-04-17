import React from 'react';

export type TabInfo = {
    title: string;
    id: number;
    favIconUrl: string;
    windowId: number;
};

export type WindowInfo = {
    id: number;
    tabs: TabInfo[];
};