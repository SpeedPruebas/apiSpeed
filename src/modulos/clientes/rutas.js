const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')

const router = express.Router()

router.get('/', todos)
router.post('/', agregar)
router.put('/', eliminar)
router.get('/clientesTallerSucursal', clientesTallerSucursal)
router.get('/contadorClientesUsuario', contadorClientesUsuario)
router.get('/clientesSucursal/:id_sucursal', clientesSucursal)
// router.get('/:id_cliente', uno)

async function todos (req, res, next){
    try {
        const {consulta, id_cliente} = req.query
        let items 
        if (consulta === 'uno') {
            items =  await controlador.clienteUnico(id_cliente)
        }else if(consulta === 'todos'){
            items =  await controlador.clientes()
        }
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function clientesSucursal (req, res, next){
    try {
        const items =  await controlador.clientesSucursal(req.params.id_sucursal)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function clientesTallerSucursal (req, res, next){
    try {
        const {id_taller, id_sucursal} = req.query
        const items =  await controlador.clientesTallerSucursal(id_taller, id_sucursal)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}

async function contadorClientesUsuario (req, res, next){
    try {
        const items =  await controlador.contadorClientesUsuario(req.query.id_usuario)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function uno(req, res, next){
    try {
        const items = await controlador.cliente(req.params.id_cliente)
        respuesta.success(req, res, items[0], 200)
    } catch (error) { next(error) }
}
async function agregar(req, res, next){
    try {
        const items = await controlador.agregar(req.body)
        mensaje  =  (items.insertId) ? items.insertId : 'Item actualizado'
        respuesta.success(req, res, mensaje, 201)
    } catch (error) { next(error) }
}
async function eliminar(req, res, next){
    try {
        const items = await controlador.eliminar(req.body)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) { next(error) }
}

module.exports = router