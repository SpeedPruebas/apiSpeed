const express = require('express')
const morgan = require('morgan')
const config = require('./config')
const cors = require('cors')

const clientes = require('./modulos/clientes/rutas')
const usuarios = require('./modulos/usuarios/rutas')
const auth = require('./modulos/auth/rutas')
const error = require('./red/errores')
const sucursales = require('./modulos/sucursales/rutas')
const moRefacciones = require('./modulos/moRefacciones/rutas')
const vehiculos = require('./modulos/vehiculos/rutas')
const cotizaciones = require('./modulos/cotizaciones/rutas')
const recepciones = require('./modulos/recepciones/rutas')
const gastos_orden = require('./modulos/gastos_orden/rutas')
const pagos_orden = require('./modulos/pagos_orden/rutas')
const empresas = require('./modulos/empresas/rutas')
const formaPago = require('./modulos/formaPago/rutas')
const elementos_cotizacion = require('./modulos/elementos_cotizacion/rutas')
const elementos_recepcion = require('./modulos/elementos_recepcion/rutas')
const imagenes_recepciones = require('./modulos/imagenes_recepciones/rutas')
const gastosDiarios = require('./modulos/gastosDiarios/rutas')
const gastos_operacion = require('./modulos/gastos_operacion/rutas')
const anios = require('./modulos/anios/rutas')
const marcas = require('./modulos/marcas/rutas')
const modelos = require('./modulos/modelos/rutas')
const categorias = require('./modulos/categorias/rutas')
const contador = require('./modulos/contador/rutas')
const roles = require('./modulos/roles/rutas')
const servicios = require('./modulos/servicios/rutas')
const historial_cliente = require('./modulos/historial_cliente/rutas')
const promociones = require('./modulos/promociones/rutas')
const paquetes = require('./modulos/paquetes/rutas')
const elementosPaquetes = require('./modulos/elementosPaquetes/rutas')
const mod_paquetes = require('./modulos/mod_paquetes/rutas')
const depositos= require('./modulos/depositos/rutas')

const app = express()
// Middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//configuracion
app.set('port', config.app.port)
const whiteList=['https://proyectopruebas-5bfd4.web.app','...'];
app.use(cors({origin: whiteList}));
//rutas
app.use('/api/clientes', clientes)
app.use('/api/usuarios', usuarios)
app.use('/api/auth', auth)
app.use('/api/sucursales', sucursales)
app.use('/api/moRefacciones', moRefacciones)
app.use('/api/paquetes', paquetes)
app.use('/api/elementosPaquetes', elementosPaquetes)
app.use('/api/vehiculos', vehiculos)
app.use('/api/cotizaciones', cotizaciones)
app.use('/api/recepciones', recepciones)
app.use('/api/gastos_orden', gastos_orden)
app.use('/api/pagos_orden', pagos_orden)
app.use('/api/empresas', empresas)
app.use('/api/formaPago', formaPago)
app.use('/api/elementos_cotizacion', elementos_cotizacion)
app.use('/api/elementos_recepcion', elementos_recepcion)
app.use('/api/imagenes_recepciones', imagenes_recepciones)
app.use('/api/gastosDiarios', gastosDiarios)
app.use('/api/gastos_operacion', gastos_operacion)
app.use('/api/historial_cliente', historial_cliente)
app.use('/api/anios', anios)
app.use('/api/marcas', marcas)
app.use('/api/modelos', modelos)
app.use('/api/categorias', categorias)
app.use('/api/contador', contador)
app.use('/api/roles', roles)
app.use('/api/servicios', servicios)
app.use('/api/formaPago', formaPago)
app.use('/api/promociones', promociones)
app.use('/api/mod_paquetes', mod_paquetes)
app.use('/api/depositos', depositos)
app.use(error)


module.exports = app