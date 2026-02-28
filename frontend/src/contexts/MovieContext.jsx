import { createContext, useState, useEffect, useContext } from "react";
import { useUserContext } from "./UserContext";

 const MovieContext = createContext() 
//  it returns an object so moviecontext={provider:<moviecontext.provider/>, consumer: <moviecontext.consumer/>}

export const useMovieContext = () => useContext(MovieContext)
// What happens:
// useContext(MovieContext) is a React hook.
// It looks up the React tree for the nearest <MovieContext.Provider>.
// It then returns whatever you gave that Provider as its value.
// In your case, later inside the Provider, you give:
// value={Value}

// So:
// What useMovieContext() returns:
// → The Value object that you define inside your provider, which looks like:
// {
//   favorites,             // current state array
//   addToFavorites,        // function
//   removeFromFavorites,   // function
//   isFavortie             // function
// }
// Any component calling useMovieContext() gets that exact object.



export const MovieProvider = ({children})=>{

    const [refresh, setRefresh]= useState(false)

    const [favorites,setFavorites] = useState([])
    const [currMovie, setCurrMovie]= useState("")
    const {user}=useUserContext()


    const url = `${import.meta.env.VITE_API_URL}/favorites/`
    

    useEffect(()=>{
        if (!user?.id) return
        const FetchFavorites =async ()=>{
            const response= await fetch(`${url}${user.id}`)
            const data=await response.json()
            const fetchedMovies = data.map(m =>(typeof m.movie === 'string'? JSON.parse(m.movie): m.movie)).filter(Boolean)
            setFavorites(fetchedMovies)
        }
        FetchFavorites()
    },[user?.id, refresh])



    
    
    const addToFavorites =async(movie)=>{
        setFavorites(prev => [...prev, movie])
        setCurrMovie(movie)
        const movieId= movie.id
        const userId=user.id
        const Movie=movie
        const options={
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body: JSON.stringify({
                userId,movieId,Movie
                
            })
        }
        const response = await fetch(url,options)
        
        setRefresh(refresh)
        

    

    }

    const removeFromFavorites= async (Movie)=>{
        setFavorites(prev=>prev.filter(movie=>movie.id!=Movie.id))
       
        const options ={
            method : "DELETE",
            headers : {
                'content-Type': 'application/json'
            }
        }
        const response = await fetch(`${url}${user.id}/${Movie.id}`,options)


        
        

        
        setRefresh(refresh)
       
    }
    
    const isFavortie =(Movie)=>{
       if (!Movie) return false
       return  favorites.some(movie=>movie && movie.id==Movie.id)
    }

    const Value={
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavortie
        
    }

    return <MovieContext.Provider value={Value}>
        {children}
    </MovieContext.Provider>

}