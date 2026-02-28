import { useState,useContext, createContext } from "react";


const UserContext = createContext()

export const useUserContext = ()=>useContext(UserContext);

export const UserProvider =({children})=>{

    const [user,setUser]=useState(()=>{
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : "";
    })

    const getUser =(user)=>{
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        console.log(user,"from user context")
    }

    const updateUser = (updated) => {
        setUser(updated)
        localStorage.setItem('user', JSON.stringify(updated))
    }

    const logout = () => {
        setUser("")
        localStorage.removeItem('user')
        localStorage.removeItem('loginStatus')
        window.location.href = '/'
    }

    const value ={
        user,
        getUser,
        updateUser,
        logout,
    }

    return <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>

}