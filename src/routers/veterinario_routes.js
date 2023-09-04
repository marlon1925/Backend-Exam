import { Router } from "express";
import {
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
    nuevoPassword,
} from "../controllers/veterinario_controller.js";
import verificarAutenticacion from '../middlewares/autenticacion.js'

const router = Router();

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Login Veterinario
 *     summary: Autenticar un veterinario.
 *     description: Iniciar sesión de un veterinario en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del veterinario.
 *                 example: veterinario@example.com
 *               password:
 *                 type: string
 *                 description: Contraseña del veterinario.
 *                 example: contraseñaSegura
 *     responses:
 *       200:
 *         description: Autenticación exitosa. Se devuelve el token de acceso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de acceso para el veterinario autenticado.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Credenciales incorrectas. La autenticación ha fallado.
 *       500:
 *         description: Error interno del servidor. Contacte al administrador.
 */
router.post('/login',login)



/**
 * @swagger
 * /registro:
 *   post:
 *     tags:
 *       - Registro Veterinario
 *     summary: Registrar un nuevo veterinario.
 *     description: Registrar un nuevo veterinario en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del veterinario.
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 description: Apellido del veterinario.
 *                 example: Pérez
 *               direccion:
 *                 type: string
 *                 description: Dirección del veterinario.
 *                 example: Calle Principal 123
 *               telefono:
 *                 type: number
 *                 description: Número de teléfono del veterinario.
 *                 example: 1234567890
 *               email:
 *                 type: string
 *                 description: Correo electrónico del veterinario.
 *                 example: veterinario@example.com
 *               password:
 *                 type: string
 *                 description: Contraseña del veterinario.
 *                 example: contraseñaSegura
 *     responses:
 *       201:
 *         description: Registro exitoso. Se ha creado un nuevo veterinario.
 *       400:
 *         description: Bad request, verifique los datos ingresados.
 *       409:
 *         description: Conflicto, el correo electrónico ya está registrado.
 *       500:
 *         description: Error interno del servidor. Contacte al administrador.
 */
router.post('/registro',registro)





/**
 * @swagger
 * /confirmar/{token}:
 *   get:
 *     tags:
 *       - Confirmar Email
 *     summary: Confirmar el correo electrónico del veterinario.
 *     description: Confirmar el correo electrónico del veterinario utilizando un token.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de confirmación de correo electrónico.
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Correo electrónico confirmado exitosamente.
 *       400:
 *         description: Token de confirmación no válido o caducado.
 *       404:
 *         description: Token de confirmación no encontrado.
 *       500:
 *         description: Error interno del servidor. Contacte al administrador.
 */
router.get('/confirmar/:token',confirmEmail)


/**
 * @swagger
 * /veterinarios:
 *   get:
 *     tags:
 *       - Listar Veterinarios
 *     summary: Obtener la lista de veterinarios.
 *     description: Obtener una lista de todos los veterinarios registrados en el sistema.
 *     responses:
 *       200:
 *         description: Lista de veterinarios obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Veterinario'
 *       500:
 *         description: Error interno del servidor. Contacte al administrador.
 */
router.get('/veterinarios',listarVeterinarios)



/**
 * @swagger
 * /recuperar-password:
 *   post:
 *     tags:
 *       - Recuperar Password
 *     summary: Solicitar recuperación de contraseña.
 *     description: Enviar una solicitud de recuperación de contraseña por correo electrónico.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del veterinario para la recuperación de contraseña.
 *                 example: veterinario@example.com
 *     responses:
 *       200:
 *         description: Solicitud de recuperación de contraseña enviada con éxito.
 *       400:
 *         description: Bad request, verifique los datos ingresados.
 *       404:
 *         description: Correo electrónico no encontrado en el sistema.
 *       500:
 *         description: Error interno del servidor. Contacte al administrador.
 */
router.post('/recuperar-password',recuperarPassword)



/**
 * @swagger
 * /recuperar-password/{token}:
 *   get:
 *     tags:
 *       - Comprobar TokenPasword
 *     summary: Comprobar token de recuperación de contraseña.
 *     description: Comprobar la validez de un token de recuperación de contraseña.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de recuperación de contraseña.
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token de recuperación válido.
 *       400:
 *         description: Token de recuperación no válido o caducado.
 *       404:
 *         description: Token de recuperación no encontrado.
 *       500:
 *         description: Error interno del servidor. Contacte al administrador.
 */
router.get('/recuperar-password/:token',comprobarTokenPasword)




/**
 * @swagger
 * /nuevo-password/{token}:
 *   post:
 *     tags:
 *       - Nuevo Password
 *     summary: Crear una nueva contraseña.
 *     description: Crear una nueva contraseña para el veterinario utilizando un token de recuperación.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de recuperación de contraseña.
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Nueva contraseña del veterinario.
 *                 example: nuevaContraseñaSegura
 *     responses:
 *       200:
 *         description: Nueva contraseña creada con éxito.
 *       400:
 *         description: Token de recuperación no válido o caducado.
 *       404:
 *         description: Token de recuperación no encontrado.
 *       500:
 *         description: Error interno del servidor. Contacte al administrador.
 */
router.post('/nuevo-password/:token',nuevoPassword)



/**
 * @swagger
 * /perfil:
 *   get:
 *     tags:
 *       - Perfil Veterinario
 *     summary: Obtener el perfil del veterinario autenticado.
 *     description: Obtener el perfil del veterinario que ha iniciado sesión en el sistema.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del veterinario obtenido con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Veterinario'
 *       401:
 *         description: No autorizado, se requiere autenticación.
 *       500:
 *         description: Error interno del servidor. Contacte al administrador.
 */
router.get('/perfil',verificarAutenticacion,perfil)



/**
 * @swagger
 * /veterinario/actualizarpassword:
 *   put:
 *     tags:
 *       - Actualizar Password
 *     summary: Actualizar la contraseña del veterinario autenticado.
 *     description: Actualizar la contraseña del veterinario que ha iniciado sesión en el sistema.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Contraseña actual del veterinario.
 *                 example: contraseñaActualSegura
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña del veterinario.
 *                 example: nuevaContraseñaSegura
 *     responses:
 *       200:
 *         description: Contraseña del veterinario actualizada con éxito.
 *       401:
 *         description: No autorizado, se requiere autenticación.
 *       400:
 *         description: Contraseña actual incorrecta o solicitud incorrecta.
 *       500:
 *         description: Error interno del servidor. Contacte al administrador.
 */
router.put('/veterinario/actualizarpassword',verificarAutenticacion,actualizarPassword)


/**
 * @swagger
 * /veterinario/{id}:
 *   get:
 *     tags:
 *       - Detalle Veterinario
 *     summary: Obtener el perfil de un veterinario por ID.
 *     description: Obtener el perfil de un veterinario en el sistema por su ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del veterinario a consultar.
 *         schema:
 *           type: string
 *           example: 1234567890abcdef12345678
 *     responses:
 *       200:
 *         description: Perfil del veterinario obtenido con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Veterinario'
 *       401:
 *         description: No autorizado, se requiere autenticación.
 *       404:
 *         description: Veterinario no encontrado.
 *       500:
 *         description: Error interno del servidor. Contacte al administrador.
 */
router.get('/veterinario/:id',verificarAutenticacion,detalleVeterinario)


/**
 * @swagger
 * /veterinario/{id}:
 *   put:
 *     tags:
 *       - Actualizar Perfil
 *     summary: Actualizar el perfil de un veterinario por ID.
 *     description: Actualizar el perfil de un veterinario en el sistema por su ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del veterinario a actualizar.
 *         schema:
 *           type: string
 *           example: 1234567890abcdef12345678
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Veterinario'
 *     responses:
 *       200:
 *         description: Perfil del veterinario actualizado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Veterinario'
 *       401:
 *         description: No autorizado, se requiere autenticación.
 *       404:
 *         description: Veterinario no encontrado.
 *       400:
 *         description: Solicitud incorrecta o datos inválidos.
 *       500:
 *         description: Error interno del servidor. Contacte al administrador.
 */
router.put('/veterinario/:id',verificarAutenticacion,actualizarPerfil)


export default router;