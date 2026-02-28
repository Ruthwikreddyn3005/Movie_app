import express from 'express';
import cors from "cors";
import mysql from 'mysql2';
import {faker} from '@faker-js/faker'
let app = express();

app.use(cors());
app.use(express.json())
const connection = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || 'Ruthwik@123',
    database: process.env.DB_NAME     || 'movie_app',
    port:     process.env.DB_PORT     || 3306,
    waitForConnections: true,
    connectionLimit: 10,
})

const PORT = process.env.PORT || 8080
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

// app.get('/profile',(req,res)=>{
//     res.json({message:'Welcome to the profile Page'});
    
// })

const getRandomId =()=>{
    return faker.number.int();
}

app.get('/login/:username',(req,res)=>{

    connection.query('SELECT id,username,email,password FROM users WHERE username=? or email=?',[req.params.username,req.params.username],(err,results)=>{
        if(err){
            res.status(400).send({message:"user not found"})
            console.log(results)
            console.log(err)
            
        }
        else{
            res.send(results)
            console.log(results)
        }
    })
})


app.post('/register',(req,res)=>{
    
    const {username,email,password}=req.body
    connection.query('INSERT INTO users (username,email,password) VALUES (?,?,?)',[username,email,password], (err,results)=>{
        if(err){
            console.log('Register error:', err)
            res.status(400).send(err)

        }
        else{
            res.status(200).send(results)
           

        }
    })
})


app.get('/favorites/:id',(req,res)=>{
    console.log("routehit")
    const id=req.params.id
    connection.query('SELECT M.movie FROM movies M, favorites F WHERE F.movie_id = M.movie_id AND F.user_id=?',[id], (err,results)=>{
        
      if (err) return res.status(500).json({ message: 'DB error', error: String(err.code || err) });
      res.json(results || []);
    
    })
    
    
})

app.post('/favorites',async (req,res)=>{
    console.log(req.body)
    const {userId, Movie, movieId}= req.body
    const movieString= typeof Movie==="string"? Movie : JSON.stringify(Movie)

    connection.query('INSERT IGNORE INTO movies (movie_id,movie) VALUES(?,?)',[movieId,movieString],(err,results)=>{
       if (err) return res.status(500).json({ message: 'Insert movie failed', error: String(err.code || err) });
    })

    connection.query('INSERT INTO favorites (user_id,movie_id) VALUES (?,?)',[userId,movieId],(err,results)=>{
        if (err) return res.status(500).json({ message: 'Insert favorite failed', error: String(err.code || err) });
          res.status(201).json({ ok: true });
        
    })
    
})

app.delete('/favorites/:user_id/:movie_id', async(req,res)=>{
    console.log("route hit")
    const user_id= req.params.user_id
    const movie_id= req.params.movie_id
    connection.query('DELETE FROM favorites WHERE user_id=? and movie_id=?',[user_id,movie_id],(err,results)=>{
        if(err) return res.status(500).json({message: 'DELETE movie failed', error: String(err.code || err)})
        console.log("maybe deleted")
    })

})

// Run this SQL once to add phone & bio columns:
// ALTER TABLE users ADD COLUMN phone VARCHAR(20), ADD COLUMN bio TEXT;

app.get('/profile/:id',(req,res)=>{
    // Try with phone & bio first; fall back to base columns if they don't exist yet
    connection.query(
        'SELECT id, username, email, phone, bio FROM users WHERE id=?',
        [req.params.id],
        (err, results)=>{
            if(err){
                // phone/bio columns likely missing — retry with base columns only
                connection.query(
                    'SELECT id, username, email FROM users WHERE id=?',
                    [req.params.id],
                    (err2, results2)=>{
                        if(err2) return res.status(500).json({ message: 'DB error', error: String(err2.code || err2) })
                        if(results2.length === 0) return res.status(404).json({ message: 'User not found' })
                        res.json({ ...results2[0], phone: null, bio: null })
                    }
                )
                return
            }
            if(results.length === 0) return res.status(404).json({ message: 'User not found' })
            res.json(results[0])
        }
    )
})

app.put('/profile/:id',(req,res)=>{
    const { username, email, password, phone, bio } = req.body
    connection.query(
        'UPDATE users SET username=?, email=?, password=?, phone=?, bio=? WHERE id=?',
        [username, email, password, phone, bio, req.params.id],
        (err, results)=>{
            if(err) return res.status(500).json({ message: 'Update failed', error: String(err.code || err) })
            res.json({ ok: true })
        }
    )
})



