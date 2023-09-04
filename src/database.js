import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
mongoose.set('strictQuery', true)

const connection = async()=>{
    try {
        console.log(process.env.MONGODB_URI)
        const {connection} = await mongoose.connect(process.env.MONGODB_URI,{
            useUnifiedTopology:true,
            useNewUrlParser:true,
        })
        console.log(`Database is connected on ${connection.host} - ${connection.port}`)
    } catch (error) {
        console.log(error);
    }
}

export default  connection