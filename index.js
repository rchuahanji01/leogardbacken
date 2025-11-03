const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const bodyparser = require('body-parser')
app.use(bodyparser.json())
const connectdb = require('./db/connection')
const port = process.env.port || 3000
const cors = require('cors')

app.use(cors({
    origin:'*'
}))
app.get('/' , (req,res)=>{
    res.send('hellow ')
})
app.use("/uploads", express.static("uploads"));

app.use('/api/leogaurd/login' , require('./routes/Login'))
app.use('/api/leogaurd/register' , require('./routes/register'))
app.use('/api/leogaurd/product' , require('./routes/productRoute'))
app.use('/api/leogaurd/category' , require('./routes/categoryRoute'))
app.use('/api/leogaurd/sendemail' , require('./routes/contactRoute'))
console.log("<<<<<<<<<<<<<< route exicuted>>>>>>>>>>>>>>>>>>>>>")
const startServer = async ()=>{
    try{
        app.listen(port , ()=>{
        console.log(`server is running on http://localhost:${port}`)
        connectdb()
    })
    }catch(err){
        console.log('unabel to start the srevre ' , err)
        setTimeout(()=>{
            startServer()
        },5000)
    }
}

startServer()

setInterval(() => {
  fetch('https://leogardbacken.onrender.com')
    .then(res => console.log('Keep-alive ping:', res.status))
    .catch(err => console.error('Ping failed:', err.message));
}, 10 * 60 * 1000);
