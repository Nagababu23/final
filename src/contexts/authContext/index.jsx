import React, { useEffect, useState ,useContext} from "react";

import {auth} from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContest=React.createContext();

export function AuthContest({children}){
    const [currentUser , setCurrentUser] =useState(null);
    const [userLogin , setUserlogin] =useState(false);
    const [loading , setLoading] =useState(true);

    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,initializeUser);
        if(user){
            setCurrentUser({...user})
            setUserlogin(true)
        }else{
            setCurrentUser(null)
            setUserlogin(false)
        }
        setLoading(false)
    })

    const value={
        currentUser,
        userLogin,
        loading
    }

    return (
        <AuthContest.Provider value={value}>
            {!loading && children}
        </AuthContest.Provider>
    )
}