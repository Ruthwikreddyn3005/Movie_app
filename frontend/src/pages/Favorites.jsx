import { useEffect } from "react";
import "../CSS/Favorites.css"
import MovieCard from "../components/MovieCard";
import { useMovieContext } from "../contexts/MovieContext";


const Favorites=()=>{
    const {favorites}=useMovieContext()
   console.log("re-rendered")
    

    if (favorites.length){
        return <>
        <div className="fvaorites">
            <h2>Favorite Movies</h2>
            <div className="movies-grid">
                {favorites.map((movie)=>(
                   <MovieCard key={movie.id} movie={movie}/>

                ))}



            </div>
        </div>
        
        </>
           
    }

    return (<>
        <div className="favorites"> <h2>No Favorites.</h2></div>
       


    </>
)
}

export default Favorites;