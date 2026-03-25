import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AuthLayout({children, authentication = true}){
    const authStatus = useSelector((state) => state.auth.isAuthenticated);
    if(authentication && !authStatus){
        return <Navigate to = "/login" replace />
    }
    if(!authentication && authStatus){
        return <Navigate to = "/" replace/>
    }
return children;
}