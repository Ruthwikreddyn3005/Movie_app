import { useState } from "react";
import { createContext, useContext } from "react";  

export const OverviewContext = createContext(null)
export const useOverviewContext = ()=> useContext(OverviewContext)

export const MovieView= ({children})=>{

    const [currMovie,setCurrMovie]=useState(null)

    const getMovie=(movie)=>{
        setCurrMovie(movie)
    }
    const value={
        currMovie,
        getMovie
    }
    console.log(currMovie)
    return (
        <OverviewContext.Provider value={value}>
            {children}
        </OverviewContext.Provider>
    )


}