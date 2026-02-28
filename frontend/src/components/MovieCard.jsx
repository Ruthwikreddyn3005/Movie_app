import { Link } from "react-router-dom"
import { useMovieContext } from "../contexts/MovieContext"
import "../CSS/MovieCard.css"
import { useOverviewContext } from "../contexts/MovieView"


const MovieCard=({movie})=>{

    

    const {favorites,addToFavorites,removeFromFavorites,isFavortie}= useMovieContext()
    const {currMovie,getMovie}=useOverviewContext()

    const favorite = isFavortie(movie)

    const handleMovieClick=()=>{
        
        getMovie(movie)
        
        

    }

    const handleFavorite=(e)=>{
        e.preventDefault()
        console.log("btn Worked")
        if (favorite) removeFromFavorites(movie)
        else addToFavorites(movie)


    }
        
    return <Link to="/movieoverview" onClick={handleMovieClick}> 
    
        <div  className="movie-card">
            <div className="movie-poster">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="movie-overlay">
                    <button className={`favorite-btn ${favorite ? "active":""}`} onClick={handleFavorite}> ♥</button>
                </div>
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.release_date.split("-")[0]}</p>
            </div>
        </div>

    </Link>
}
export default MovieCard;