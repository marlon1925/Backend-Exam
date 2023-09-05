import Veterinario from "../models/Veterinario.js"
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";

const login = async(req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Sorry, you must fill in all the fields"})
    const veterinarioBDD = await Veterinario.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
    if(veterinarioBDD?.confirmEmail===false) return res.status(403).json({msg:"Sorry, you need to verify your account"})
    if(!veterinarioBDD) return res.status(404).json({msg:"Sorry, the user is not registered"})
    const verificarPassword = await veterinarioBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Sorry, you must fill in all the fields"})
    const token = generarJWT(veterinarioBDD._id)
    const {nombre,apellido,direccion,telefono,_id} = veterinarioBDD
    res.status(200).json({
        token,
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
        email:veterinarioBDD.email
    })
}


const perfil =(req,res)=>{
    delete req.veterinarioBDD.token
    delete req.veterinarioBDD.confirmEmail
    delete req.veterinarioBDD.createdAt
    delete req.veterinarioBDD.updatedAt
    delete req.veterinarioBDD.__v
    res.status(200).json(req.veterinarioBDD)
}

const registro = async (req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Sorry, you must fill in all fields"})
    const verificarEmailBDD = await Veterinario.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Sorry, the email is already registered"})
    const nuevoVeterinario = new Veterinario(req.body)
    nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password)
    const token = nuevoVeterinario.crearToken()
    await sendMailToUser(email,token)
    await nuevoVeterinario.save()
    res.status(200).json({msg:"Check your email to confirm your account"})
}


const confirmEmail = async (req,res)=>{
    if(!(req.params.token)) return res.status(400).json({msg:"Sorry, account cannot be validated"})
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
    if(!veterinarioBDD?.token) return res.status(404).json({msg:"The account has already been confirmed"})
    veterinarioBDD.token = null
    veterinarioBDD.confirmEmail=true
    await veterinarioBDD.save()
    res.status(200).json({msg:"Token confirmed, you can now log in"}) 
}



const listarVeterinarios = (req,res)=>{
    res.status(200).json({res:'List of registered veterinarians'})
}


const detalleVeterinario = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Sorry, it must be a valid id`});
    const veterinarioBDD = await Veterinario.findById(id).select("-password")
    if(!veterinarioBDD) return res.status(404).json({msg:`Sorry, there is no vet ${id}`})
    res.status(200).json({msg:veterinarioBDD})
}


const actualizarPerfil = async (req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Sorry, it must be a valid id`});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Sorry, you must fill in all fields"})
    const veterinarioBDD = await Veterinario.findById(id)
    if(!veterinarioBDD) return res.status(404).json({msg:`Sorry, there is no vet ${id}`})
    if (veterinarioBDD.email !=  req.body.email)
    {
        const veterinarioBDDMail = await Veterinario.findOne({email:req.body.email})
        if (veterinarioBDDMail)
        {
            return res.status(404).json({msg:`Sorry, the exists is already registered`})  
        }
    }
    veterinarioBDD.nombre = req.body.nombre 
    veterinarioBDD.apellido = req.body.apellido 
    veterinarioBDD.direccion = req.body.direccion 
    veterinarioBDD.telefono = req.body.telefono 
    veterinarioBDD.email = req.body.email 
    await veterinarioBDD.save()
    res.status(200).json({msg:"Profile updated successfully"})
}



const actualizarPassword = async (req,res)=>{
    const veterinarioBDD = await Veterinario.findById(req.veterinarioBDD._id)
    if(!veterinarioBDD) return res.status(404).json({msg:`Sorry, there is no vet ${id}`})
    const verificarPassword = await veterinarioBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Sorry, the current password is not correct"})
    veterinarioBDD.password = await veterinarioBDD.encrypPassword(req.body.passwordnuevo)
    await veterinarioBDD.save()
    res.status(200).json({msg:"Password updated successfully"})
}





const recuperarPassword = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Sorry, you must fill in all fields"})
    const veterinarioBDD = await Veterinario.findOne({email})
    if(!veterinarioBDD) return res.status(404).json({msg:"Sorry, the user is not registered"})
    const token = veterinarioBDD.crearToken()
    veterinarioBDD.token=token
    await sendMailToRecoveryPassword(email,token)
    await veterinarioBDD.save()
    res.status(200).json({msg:"Check your email to reset your account"})
}

const comprobarTokenPasword = async (req,res)=>{
    if(!(req.params.token)) return res.status(404).json({msg:"Sorry, account cannot be validated"})
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
    if(veterinarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Sorry, account cannot be validated"})
    await veterinarioBDD.save()
    res.status(200).json({msg:"Token confirmed, you can now create your new password"}) 
}

const nuevoPassword = async (req,res)=>{
    const{password,confirmpassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Sorry, you must fill in all fields"})
    if(password != confirmpassword) return res.status(404).json({msg:"Sorry, passwords don't match"})
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
    if(veterinarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Sorry, account cannot be validated"})
    veterinarioBDD.token = null
    veterinarioBDD.password = await veterinarioBDD.encrypPassword(password)
    await veterinarioBDD.save()
    res.status(200).json({msg:"Congratulations, you can now log in with your new password"}) 
}



export {
    login,
    perfil,
    registro,
    confirmEmail,
    listarVeterinarios,
    detalleVeterinario,
    actualizarPerfil,
    actualizarPassword,
	recuperarPassword,
    comprobarTokenPasword,
	nuevoPassword
}