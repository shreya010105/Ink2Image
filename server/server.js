require('dotenv').config()
const express = require('express')
const cors = require('cors')
const ConnectDB = require('./config/mongodb')
const userRoute = require('./routes/userRoutes')
const imageRoute = require('./routes/imageRoutes')

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:5173", "https://ink-2-image.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
ConnectDB()

app.use('/api/auth',userRoute)
app.use('/api/image',imageRoute)

app.use('/',(req,res) => {
    res.send('api working')
})

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    
})