import {Router} from 'express'
import {
    actualizarPaciente,
    detallePaciente,
    eliminarPaciente,
    listarPacientes,
    registrarPaciente,
} from "../controllers/paciente_controller.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";

const router = Router()


/**
 * @swagger
 * /pacientes:
 *   get:
 *     tags:
 *       - Listar Pacientes
 *     summary: Retrieve a list of patients.
 *     description: Retrieve a list of patients.
 *     responses:
 *       200:
 *         description: A list of patients.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Paciente'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Paciente:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the paciente.
 *           example: 1234567890abcdef12345678
 *         nombre:
 *           type: string
 *           description: The patient's name.
 *           example: Juan Perez
 *         propietario:
 *           type: string
 *           description: The owner's name.
 *           example: Maria Rodriguez
 *         email:
 *           type: string
 *           description: The patient's email address.
 *           example: juan@example.com
 *         celular:
 *           type: string
 *           description: The patient's cell phone number.
 *           example: +1234567890
 *         convencional:
 *           type: string
 *           description: The patient's landline phone number.
 *           example: +9876543210
 *         ingreso:
 *           type: string
 *           format: date-time
 *           description: The date and time of patient admission.
 *           example: 2023-09-02T10:00:00Z
 *         sintomas:
 *           type: string
 *           description: Description of patient symptoms.
 *           example: Coughing and sneezing.
 *         salida:
 *           type: string
 *           format: date-time
 *           description: The date and time of patient discharge.
 *           example: 2023-09-02T14:30:00Z
 *         estado:
 *           type: boolean
 *           description: The patient's current status (true for active, false for inactive).
 *           example: true
 *         veterinario:
 *           type: string
 *           description: The ID of the associated veterinarian.
 *           example: 1234567890abcdef12345679
 */
router.get("/pacientes",verificarAutenticacion,listarPacientes);



/**
 * @swagger
 * /paciente/{id}:
 *   get:
 *     tags:
 *       - Detalle paciente
 *     summary: Retrieve a specific patient by ID.
 *     description: Retrieve a specific patient by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier for the patient.
 *         schema:
 *           type: string
 *           example: 1234567890abcdef12345678
 *     responses:
 *       200:
 *         description: The requested patient.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paciente'
 *       404:
 *         description: Patient not found.
 */
router.get("/paciente/:id",verificarAutenticacion, detallePaciente);


/**
 * @swagger
 * /paciente/registro:
 *   post:
 *     tags:
 *       - Registrar Paciente
 *     summary: Register a new patient.
 *     description: Register a new patient in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       201:
 *         description: The patient has been successfully registered.
 *       400:
 *         description: Bad request, check your input data.
 */
router.post("/paciente/registro", verificarAutenticacion,registrarPaciente);


/**
 * @swagger
 * /paciente/actualizar/{id}:
 *   put:
 *     tags:
 *       - Actualizar Paciente
 *     summary: Update an existing patient by ID.
 *     description: Update an existing patient in the system by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier for the patient to be updated.
 *         schema:
 *           type: string
 *           example: 1234567890abcdef12345678
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       200:
 *         description: The patient has been successfully updated.
 *       400:
 *         description: Bad request, check your input data.
 *       404:
 *         description: Patient not found.
 */
router.put("/paciente/actualizar/:id", verificarAutenticacion,actualizarPaciente);


/**
 * @swagger
 * /paciente/eliminar/{id}:
 *   delete:
 *     tags:
 *       - Eliminar Paciente
 *     summary: Delete a patient by ID.
 *     description: Delete a patient from the system by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier for the patient to be deleted.
 *         schema:
 *           type: string
 *           example: 1234567890abcdef12345678
 *     responses:
 *       204:
 *         description: The patient has been successfully deleted.
 *       404:
 *         description: Patient not found.
 */
router.delete("/paciente/eliminar/:id", verificarAutenticacion,eliminarPaciente);


export default router