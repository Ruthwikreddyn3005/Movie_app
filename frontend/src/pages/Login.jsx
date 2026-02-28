import '../CSS/Login.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import { getPopularMovies } from '../services/api';

const Login = ({setLoginStatus, setCreateStatus}) =>{
    const {getUser}=useUserContext()
    const navigate = useNavigate()
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [user, setUser]=useState('')
    const [loginMessage, setLoginMessage]=useState('')
    const [posters, setPosters] = useState([])

    useEffect(()=>{
        getPopularMovies()
            .then(movies => {
                const shuffled = [...movies].sort(() => Math.random() - 0.5)
                setPosters(shuffled)
            })
            .catch(()=>{})
    },[])

    const fetchUser= async ()=>{
        if (username.trim()==='' || password.trim()==='' ){
            setLoginMessage('Username or password cannot be empty')
            return
        }
        const url = `${import.meta.env.VITE_API_URL}/login/${encodeURIComponent(username)}`
        const response=await fetch(url)
        if (!response.ok) {
            setLoginMessage(`Server error: ${response.status}`);
            return;
        }
        if(response.status===200){
            const data= await response.json()
            if (!Array.isArray(data) || data.length===0){
                setLoginMessage('User does not exist')
                return
            }
            const fetchedUser=data[0]
            setUser(data[0])
            if (fetchedUser.password!==password){
                setUser('')
                setLoginMessage('Incorrect password')
                return
            }
            setLoginStatus(true)
            getUser(fetchedUser)
            navigate('/', { replace: true })
        }
    }

    const onLoginHandler=()=>{ fetchUser() }
    const onRegisterHandler = ()=>{ setCreateStatus(false); setLoginStatus(true) }
    const handleKey = (e) => { if(e.key === 'Enter') fetchUser() }

    return (
        <div className='login-page'>
            <div className='login-main'>
                <div className='login-left'>
                    <div className='left-fade'/>
                    <div className='brand'>
                        <div className='brand-icon'>&#127909;</div>
                        <h1 className='brand-name'>Movie App</h1>
                        <p className='brand-tagline'>Your personal cinema universe</p>
                    </div>
                </div>

                <div className='login-right'>
                    <div className='login-box'>
                        <h2 id='login-title'>Welcome Back</h2>
                        <p className='login-subtitle'>Sign in to continue</p>
                        <div className='login-form'>
                            <div className='username-box'>
                                <label htmlFor='username'>Username / Email</label>
                                <input
                                    type='text'
                                    id='username'
                                    name='username'
                                    placeholder='Enter your username'
                                    value={username}
                                    onChange={(e)=>setUsername(e.target.value)}
                                    onKeyDown={handleKey}
                                />
                            </div>
                            <div className='password-box'>
                                <label htmlFor='password'>Password</label>
                                <input
                                    type='password'
                                    id='password'
                                    name='password'
                                    placeholder='Enter your password'
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                    onKeyDown={handleKey}
                                />
                            </div>
                            {loginMessage && <p id='login-message'>{loginMessage}</p>}
                            <div className='login-btn-box'>
                                <button onClick={onLoginHandler} className='login-btn'>Sign In</button>
                            </div>
                        </div>
                        <div className='register-box'>
                            <p>Don't have an account?</p>
                            <button onClick={onRegisterHandler} className='register-btn'>Create Account</button>
                        </div>
                    </div>
                </div>
            </div>

            {posters.length > 0 && (
                <div className='movie-strip'>
                    <div className='strip-fade-left'/>
                    <div className='strip-fade-right'/>
                    {posters.map(movie => (
                        <div key={movie.id} className='poster-thumb'>
                            {movie.poster_path
                                ? <img src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={movie.title}/>
                                : <div className='poster-placeholder'>{movie.title?.[0]}</div>
                            }
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default Login;
