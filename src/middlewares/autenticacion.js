import jwt from 'jsonwebtoken'
import Veterinario from '../models/Veterinario.js'


const verificarAutenticacion = async (req,res,next)=>{

if(!req.headers.authorization) return res.status(404).json({msg:"Sorry, you must provide a token"})    
    const {authorization} = req.headers
    try {
        const {id} = jwt.verify(authorization.split(' ')[1],process.env.JWT_SECRET)
        req.veterinarioBDD = await Veterinario.findById(id).lean().select("-password")
        next()
    } catch (error) {
        const e = new Error("Invalid token format")
        return res.status(404).json({msg:e.message})
    }
}

export default verificarAutenticacion