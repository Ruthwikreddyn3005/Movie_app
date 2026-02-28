import { useOverviewContext } from "../contexts/MovieView"
import { Link } from "react-router-dom"

const MoviePage=()=>{
    const {currMovie}=useOverviewContext()

    if (!currMovie){
        return <h2>No Movie Selected</h2>
    }
    
    const censor=currMovie.adult? "A":"U"

    return <>
    <div className="moviedesk">
        <Link to="/" className="nav-link">Home</Link>
        <div className="moviecard">
            <div>
                <img src={`https://image.tmdb.org/t/p/w500${currMovie.backdrop_path}`} alt={currMovie.title} />
            </div>
            <div className="movie-info">
                 <h2 className="movie-title">{currMovie.title}
                    
                </h2>
                <p>{currMovie.release_date.split("-")[0]} <span>{currMovie.original_language.toUpperCase()}</span> <span>{censor}</span></p>
            </div>
           
        </div>
        <div className="movie-description">
            <p>{currMovie.overview}</p>
        </div>

    </div>
    
    
    </>
}
export default MoviePage