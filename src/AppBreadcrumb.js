import React from 'react';
import { useLocation } from 'react-router-dom';

const AppBreadcrumb = (props) => {
    const location = useLocation();
    return <><span>Dashboard</span></>;
};

export default AppBreadcrumb;
