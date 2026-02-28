import { useState } from "react"
import "../CSS/Register.css"

const Register = ({setCreateStatus,setLoginStatus})=>{

    const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [password, setPassword ] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [registerStatus, setRegisterstatus] = useState(false)

    const onCreateHandler = async()=>{

        if(username.trim()==="" || email.trim()==="" || password.trim()==="" || confirmPassword===""){
            setErrorMessage("Any feilds should not be empty")
            return
        }
        

        // check if password and email follow ruls
        const validateEmail = (email) => {
        // Simple email regex
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
        };


        // Password rule: 1 lowercase, 1 uppercase, 1 number, min 8 characters        
        const validatePassword = (password) => {
            const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            return re.test(password);
        };

        if(!validateEmail(email) || !validatePassword(password)){
            const message=validateEmail(email)?"password must have 1 lowercase, 1 uppercase, 1 number, min 8 characters" : "invalid email"
            setErrorMessage( message)
            return
        }
        
        if (password!==confirmPassword){
            setErrorMessage("password and confirm password should be same")
            return 
        }
        
        const data = {
            username: username,
            email : email,
            password : confirmPassword
        }

        try{
                const url = `${import.meta.env.VITE_API_URL}/register`
                const options ={
                    method : "POST",
                    headers : {
                        "content-type":"application/json"
                    },
                    body: JSON.stringify(data)
                }
                const response = await fetch(url,options)
                const responseData = await response.json()
                

                // if (responseData.code==="ER_DUP_ENTRY"){
                //     setErrorMessage("user already exists")
                //     setRegisterstatus(false)
                //     return
                // } this might not work because diff systems , codebases might wrapup error so instead
                const mysqlCode= responseData?.code || responseData?.error?.code
                if (mysqlCode==="ER_DUP_ENTRY"){
                    setErrorMessage("user already exists")
                    setRegisterstatus(false)
                    return
                }
                if (!response.ok){
                        setErrorMessage(response.message || `Registration Failed (status ${response.status})`)
                        setRegisterstatus(false)
                        return
                }
                
                    setErrorMessage("Registration succesfull")
                
                    setRegisterstatus(true)
                
        }
        catch(err){
            setErrorMessage(`Network error: ${err.message}`)
            setRegisterstatus(false)
        }
        



        
        
    }


    const onBackHandler =()=>{
        setCreateStatus(true)
        setLoginStatus(false)
    }
    
    if (registerStatus){
        return <>
            <div className="reg-page">
                <div className="reg-box">
                    <p id="success-message">User Created</p>
                    <button onClick={()=>{onBackHandler()}} id="back-btn">Back to Login</button>
                </div>
            </div>
        
        </>
    }

     return <>
         <div className="reg-page">
                <div className="reg-box">
                    <h2 id="reg-title">Register</h2>
                    
                    <div className="reg-form">
                        <div className="user-name-box">
                            <label htmlFor="user-name">Username</label>
                            <input type="text" id="user-name" name="username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                        </div>

                        <div className="email-box">
                            <label htmlFor="email">email</label>
                            <input type="email" id="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        </div>

                        <div className="pass-word-box">
                            <div className="pass-word">
                                <label htmlFor="pass-word">Password</label>
                                <input type="password" id="pass-word" name="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                            </div>
                            <div className="confirm-password">
                                <label htmlFor="confirm-password">Confirm Password</label>
                                <input type="password" id="confirm-password" name="confirm-password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                            </div>
                        </div>

                        <p id="reg-message">{errorMessage}</p>
                        
                        <div className="reg-btn-box">
                            <button onClick={()=>onCreateHandler()}className="reg-btn">Register</button>
                        </div>

                        <button onClick={()=>{onBackHandler()}} id="back-btn">Back to Login</button>
                    </div>

                
                </div>
            
            
        </div>


    </>

}

export default Register;