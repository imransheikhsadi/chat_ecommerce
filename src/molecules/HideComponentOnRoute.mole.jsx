import React from 'react'
import { useLocation } from 'react-router-dom'

export default function HideComponentOnRoute({children,route}) {
    const location = useLocation();
    if(route.includes(location.pathname))return null;
    return (
        <>
          {children}  
        </>
    )
}
