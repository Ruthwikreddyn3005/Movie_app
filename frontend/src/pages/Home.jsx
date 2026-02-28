import { useState,useEffect } from "react";
import MovieCard from "../components/MovieCard";
import "../CSS/Home.css"

import { getPopularMovies, searchMovies } from "../services/api";

const Home=()=>{

    const [inputValue, setInputValue]=useState("")
    const [movies, setMovies] = useState([])
    const [error, setError]=useState(null)
    const [loading, setLoading]=useState(true)

    useEffect(()=>{
        
       const loadPopularMovies= async ()=>{
        try{
            const popularMovies = await getPopularMovies()
            setMovies(popularMovies)
        }
        catch (err){
            console.log(err)
            setError("Failed to load")
        }
        finally{
            setLoading(false)
        }
       }

       loadPopularMovies()
       
    },[])


    const handleSearch= async (e)=>{
        e.preventDefault()
        if (!inputValue.trim()) {
            return}

        if (loading){
            return
        }

        setLoading(true)
        try {
             const searchresults= await searchMovies(inputValue)
             setMovies(searchresults)
             setError(null)
        }
        catch(err){
            console.log(err)
            setError("Failed To Load...")
        }
        finally{
            setLoading(false)
        }
        
        setInputValue("")
        
    

    }


    return(
        <div className="home">home
            <form onSubmit={handleSearch} className="search-form">
                <input className="search-input" type="text" placeholder="search movies" value={inputValue} onChange={(e)=>setInputValue(e.target.value)}></input>
                <button type="submit" className="search-button">Search</button>
            </form>
            {inputValue? <h3>Results</h3>: <h3>Popular Movies</h3>}
            {error && <div className="error-message">{error}</div>}

            {loading? <div className="loading">Loading...</div> :
            <div className="movies-grid">
                  {movies.map((movie)=>( (movie.title.toLowerCase().indexOf(inputValue.toLowerCase())!==-1)&& (<MovieCard key={movie.id} movie={movie} />)
            ))} 
            </div>}

          
        </div>
    )
}
export default Home;