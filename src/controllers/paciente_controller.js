import Paciente from "../models/Paciente.js"
import mongoose from "mongoose"

const listarPacientes = async (req,res)=>{
    const pacientes = await Paciente.find({estado:true}).where('veterinario').equals(req.veterinarioBDD).select("-salida -createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    res.status(200).json(pacientes)
}


const detallePaciente = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Sorry, there is no vet ${id}`});
    const paciente = await Paciente.findById(id).select("-createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
    res.status(200).json(paciente)
}


const registrarPaciente = async(req,res)=>{
    try{
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Sorry, you must fill in all fields"})
        const {nombre, propietario, email, celular, convencional, ingreso, sintomas, veterinario} = req.body
        const nuevoPaciente = new Paciente({nombre, propietario, email, celular, convencional, ingreso, sintomas, veterinario})
        nuevoPaciente.veterinario=req.body.id
        //console.log(req.body)
        await nuevoPaciente.save()
        res.status(200).json({msg:"Successful patient registration"})
    }
    catch(error){
        console.log(error)
    }
}



const actualizarPaciente = async(req,res)=>{
    try {
        const {id} = req.params
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Sorry, you must fill in all fields"})
        if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Sorry, there is no vet ${id}`});
        await Paciente.findByIdAndUpdate(req.params.id,req.body)
        res.status(200).json({msg:"Successful patient update"})
    } 
    catch (error) {
        console.log(error)
    }
}



const eliminarPaciente = async (req,res)=>{
    try{
        const {id} = req.params
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Sorry, you must fill in all fields"})
        if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Sorry, there is no vet ${id}`})
        const {salida} = req.body
        await Paciente.findByIdAndUpdate(req.params.id,{salida:Date.parse(salida),estado:false})
        res.status(200).json({msg:"Date of successful patient departure"})
    }
    catch(error){
        console.log(error)
    }
}

export {
    listarPacientes,
    detallePaciente,
    registrarPaciente,
    actualizarPaciente,
    eliminarPaciente
}