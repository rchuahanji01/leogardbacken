const mongoose = require('mongoose')

const connectdb = async()=>{
    try{
         mongoose.connect(process.env.MongoUrl).then(()=>{

            console.log("db connected")
         }).catch((err)=>{
            console.log(err)
         })
    }catch(err){
        console.log('something went wrong' ,err)
        console.log('trying to reconnect')
        setTimeout(()=>{
             connectdb().then(()=>{
                console.log("db connected")
             }).catch((err)=>{
                console.log(err)
             })
        },5000)
        
    }
}

module.exports = connectdb