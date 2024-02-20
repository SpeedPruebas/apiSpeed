const express = require('express')

const respuesta = require('../../red/respuestas')
const controlador= require('./index')



const router = express.Router()

router.get('/', todos)
router.post('/', agregar)
router.put('/', eliminar)
router.get('/no_cotizacion/:no_cotizacion', no_cotizacion)
router.get('/:id', consultaCotizacion)


async function todos (req, res, next){
    try {
        const items =  await controlador.todos(req.query.start, req.query.end)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function no_cotizacion(req, res, next){
    try {
        const items = await controlador.no_cotizacion(req.params.no_cotizacion)
        respuesta.success(req, res, items, 200)
    } catch (error) {
        next(error)
    }
}
async function consultaCotizacion(req, res, next){
    try {
        const items = await controlador.consultaCotizacion(req.params.id)
        respuesta.success(req, res, items[0], 200)
    } catch (error) {
        next(error)
    }
}
async function agregar(req, res, next){
    try {

        const items = await controlador.agregar(req.body)
        mensaje  =  (req.body.id === 0) ? 'Item registrado' : 'Item actualizado'
        respuesta.success(req, res, items, 201)
    } catch (error) {
        next(error)
    }
}
async function eliminar(req, res, next){
    try {
        const items = await controlador.eliminar(req.body)
        respuesta.success(req, res, 'item eliminado', 200)
    } catch (error) {
        next(error)
    }
}
module.exports = router