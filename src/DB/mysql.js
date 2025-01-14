const  mysql = require('mysql')
const config = require('../config')

const dbconfigmysql = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.db,
}
const dbconfigMariaDB = {
    host: config.mariadb.host,
    user: config.mariadb.user,
    password: config.mariadb.password,
    database: config.mariadb.db,
}

let conexion;


function conMysql() {
    conexion = mysql.createConnection(dbconfigMariaDB)

    conexion.connect((err)=>{
        if (err) {
            console.log('[db err]', err);
            setTimeout(conMysql(), 200);
        }else{
            console.log('DB conectada');
        }
    })

    conexion.on('error', err =>{
        console.log('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            conMysql()
        }else{
            throw err
        }
    })
}

conMysql()

const escapeMySQL=(dato) =>{
    return mysql.escape(dato)
}

function Todos(tabla){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM ${tabla}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function uno(tabla, id){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM ${tabla} WHERE id = ${id}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function uno2(tabla, [clave, valor]){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM ${tabla} WHERE ${clave} = ${valor}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function eliminar(tabla, data){
    return new Promise((resolve, reject) =>{
        conexion.query(`DELETE FROM ${tabla} WHERE id = ?`, data.id, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function eliminarQuery(tabla, consulta){
    return new Promise((resolve, reject) =>{
        conexion.query(`DELETE FROM ${tabla} WHERE ?`, consulta, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function agregar(tabla, data){
    return new Promise((resolve, reject) =>{
        conexion.query(`INSERT INTO  ${tabla} SET ? ON DUPLICATE KEY UPDATE ?`, [data, data], (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function query(tabla, consulta){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM ${tabla} WHERE ?`, consulta, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
// login
function dataUsuario(id_usuario){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_dataUsuario(${id_usuario});`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function queryEliminar(tabla, consulta){
    return new Promise((resolve, reject) =>{
        conexion.query(`DELETE FROM ${tabla} WHERE ?`, consulta, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function consultaModeloMarca(tabla, id_marca){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM ${tabla} WHERE id_marca = ${id_marca}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function VehiculosPaginacionTotales(data){
    const {id_taller, id_sucursal} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT COUNT(*) as total FROM vehiculos WHERE id_taller = ${id_taller} AND id_sucursal = ${id_sucursal}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function vehiculosPaginacion(data){
    const {id_taller,id_sucursal,limit,offset} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call spPaginacionVehiculos(${id_taller},${id_sucursal},${limit},${offset})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function updateKilometraje(data){
    const {id_vehiculo, kilometraje} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`UPDATE vehiculos SET kilometraje = ${kilometraje} WHERE id_vehiculo=${id_vehiculo};`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function VehiculosRelacionados(id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_vehiculos(${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function vehiculosCliente(id){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_vehiculosCliente(${id})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function cotizacionesCliente(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_dataUsuario(${id_cliente})`
        , (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function elementos_cotizaciones(id_cotizacion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_elementosCotizaciones(${id_cotizacion})`
        , (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function contador(tabla){
    return new Promise((resolve, reject) =>{
        conexion.query( `SELECT COUNT(*) as total FROM ${tabla}`
        , (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION DE CLIENTES
function semejantesClientes(data){
    const {semejantes,limite, id_taller,id_sucursal} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL busquedaLikeClientes('${semejantes}',${id_taller},${id_sucursal},${limite});`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function clientesTallerSucursal(id_taller, id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_clientesTallerSucursal(${id_taller},${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function clienteUnico(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_clienteUnico(${id_cliente})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0][0])
        })
    })
}
//CONSULTA DE VEHICULOS
function verificaPlacas(placas){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_consultaPlacas('${placas}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function semejantesVehiculos(data){
    const {semejantes,limite, id_taller,id_sucursal} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL busquedaLikeVehiculos('${semejantes}',${id_taller},${id_sucursal},${limite});`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function vehiculosTallerSucursal(id_taller, id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_vehiculosTallerSucursal(${id_taller},${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function vehiculoUnico(id_vehiculo){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_vehiculoUnico(${id_vehiculo})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0][0])
        })
    })
}
//consulta informacion relacionado con clientes
function clientesPaginacionTotales(data){
    const {id_taller, id_sucursal} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT COUNT(*) as total FROM clientes WHERE id_taller = ${id_taller} AND id_sucursal = ${id_sucursal}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function clientesPaginacionClientes(data){
    const {id_taller, id_sucursal, limit, offset} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call spclientesPaginacionClientes(${id_taller},${id_sucursal},${limit},${offset})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function clientes(){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_clientes()`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function clientesSucursal(id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_clientes_sucursal(${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function contadorClientesUsuario(id_usuario){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_contarClientesUsuario(${id_usuario})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function cliente(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_clienteUnico(${id_cliente})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
// consulta elementos compatibles de moRefaccion
function getCompatibles(id_moRefaccion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_getCompatibles(${id_moRefaccion})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function semejantesmorefacciones(data){
    const {semejantes, id_taller} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL busquedaLikiMoRefacciones('${semejantes}',${id_taller});`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
// empreas de la sucursal
function sucursalesEmpresas(id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_sucursalesEmpresas(${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
//CONSULTA DE COTIZACIONES
function consultaCotizaciones(id_taller, id_sucursal,start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_consultaCotizaciones(${id_taller},${id_sucursal},'${start}','${end}')`, 
        (error, result) =>{
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function patchDataCotizacion(id_cotizacion, data) {
    return new Promise((resolve, reject) => {
      conexion.query(`UPDATE cotizaciones SET? WHERE id_cotizacion = ${id_cotizacion}`, data, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }
function consultaCotizacion(id_cotizacion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_consultaCotizacion(${id_cotizacion})
        `, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0][0])
        })
    })
}
function cotizacionesCliente(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_cotizacionesCliente(${id_cliente})
        `, (error, result) =>{ return error ? reject(error) : resolve(result[0]) }) 
    })
}
// consulta de recepciones
function recepcionesTaller(id_taller, id_sucursal,start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_recepcionesTallerSucursal(${id_taller}, ${id_sucursal},'${start}','${end}')
        `, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function patchRecepcion(id_recepcion, data) {
    return new Promise((resolve, reject) => {
      conexion.query(`UPDATE recepciones SET? WHERE id_recepcion = ${id_recepcion}`, data, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }
function recepcionesTaller2(id_taller, id_sucursal,start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_recepcionesTallerSucursal2(${id_taller}, ${id_sucursal},'${start}','${end}')
        `, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function sp_ordenesAbiertas(id_taller, id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`call sp_ordenesAbiertas(${id_taller}, ${id_sucursal})`, 
        (error, result) =>{ return error ? reject(error) : resolve(result[0]) })
    })
}
function RecepcionConsulta(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_recepcionUnica(${id_recepcion})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0][0])
        })
    })
}
function RecepcionElementos(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_RecepcionElementos(${id_recepcion})`
        , (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function RecepcionesVehiculoConsulta(id_vehiculo){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * FROM recepciones AS recep WHERE recep.id_vehiculo = ${id_vehiculo}
        `, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function seriviciosAceptados(id_taller, id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_serviciosAceptados(${id_taller}, ${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function serviciosEntregado(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_recepcionesTallerSucursalEntregados(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function recepcionesCliente(id_cliente){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_recepcionesCliente(${id_cliente})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
// consulta data paquetes
function consultaPaquetes(data){
    const {id_taller, id_sucursal, limit, offset} = data
    
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL spPaginacionPaquetes(${id_taller},${id_sucursal},${limit},${offset})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function registraElementosPaquetes(data) {
    
    return new Promise((resolve, reject) => {
        const values = data.map(item => [
            item.id_elmenPaquete,
            item.id_paquete,
            item.id_moRefaccion,
            item.activo,
            item.costo,
            item.cantidad
          ]);
        const query = `
            INSERT INTO elementospaquetes (
                id_elmenPaquete,
                id_paquete,
                id_moRefaccion,
                activo,
                costo,
                cantidad
            ) VALUES ${conexion.escape(values)}
            ON DUPLICATE KEY UPDATE
                id_paquete = VALUES(id_paquete),
                id_moRefaccion = VALUES(id_moRefaccion),
                activo = VALUES(activo),
                costo = VALUES(costo),
                cantidad = VALUES(cantidad)
            `;
            conexion.query(query, (error, result) =>{ 
                return error ? reject(error) : resolve(result[0])
            })
    });
  }
function totalPaquetes(data){
    const {id_taller, id_sucursal} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT COUNT(*) as total FROM paquetes WHERE id_taller = ${id_taller} `, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function busquedaLikePaquetes(data){
    const {semejantes,id_taller, limit, id_sucursal} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`call busquedaLikePaquetes('${semejantes}',${id_taller}, ${id_sucursal},${limit})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}

function ObtenerDetallePaquete(id_paquete){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_detallesPaquete(${id_paquete})`, 
        (error, result) =>{
            return error ? reject(error) : resolve(result)
        })
    })
}
function ObtenerDetallePaqueteModificado(id_cotizacion, id_paquete){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_paquetesModificados(${id_cotizacion},${id_paquete})`, 
        (error, result) =>{
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function ObtenerDetallePaqueteModificadoRecep(id_recepcion, id_paquete, id_eleRecepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL ObtenerDetallePaqueteModificadoRecep(${id_recepcion},${id_paquete},${id_eleRecepcion})`, 
        (error, result) =>{
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function eliminaEleModPaqRecep(id_eleRecepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`DELETE FROM elementosmodpaquetesrecep WHERE id_eleRecepcion=${id_eleRecepcion}` , (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
// GASTOS DE ORDEN
function gastosRecepcionUnica(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOrdenRecepcion(${id_recepcion})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function sp_gastosOrdenEspecifica(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOrdenEspecifica(${id_recepcion})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function sp_gastosOrdenEspecifica(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOrdenEspecifica(${id_recepcion})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function sp_gastosOrdenesTallerSucursal(id_taller, id_sucursal, start,end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOrdenesTallerSucursal(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
// PAGOS DE ORDEN
function PagosRecepcionUnica(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_pagosOrdenRecepcion(${id_recepcion})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function pagoRecepcion(data){
    return new Promise((resolve, reject) =>{
        conexion.query(`INSERT INTO pagototalorden SET ? ON DUPLICATE KEY UPDATE ?`, [data, data], (error, result)  =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}

function sp_pagosTallerSucursal(id_taller, id_sucursal, start,end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_pagosTallerSucursal(${id_taller}, ${id_sucursal},'${start}','${end}')`,
         (error, result) =>{ return error ? reject(error) : resolve(result[0]) })
    })
}
function listaTecnicos(id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_listaTecnicos(${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function pagoTotal(id_recepcion){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT total FROM pagototalorden WHERE id_recepcion = ${id_recepcion} `, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function listaTecnicos(id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_listaTecnicos(${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// planes
function plancliente(id_usuario){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_planCliente(${id_usuario})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// SUCURSALES
function sucursalesTaller(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_sucursales(${id_taller})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function sucursalesTaller2(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_sucursales2(${id_taller})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function patchDataSucursal(id_sucursal, data) {
    return new Promise((resolve, reject) => {
      conexion.query(`UPDATE sucursales SET? WHERE id_sucursal = ${id_sucursal}`, data, (error, result) => {
        return error? reject(error) : resolve(result[0])
      })
    })
  }
function sucursalUnica(id_taller, id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_sucursalUnica(${id_taller}, ${id_sucursal})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
// USUARIOS

function updateDataUsuario(id_usuario,data){
    return new Promise((resolve, reject) =>{
        conexion.query(`UPDATE usuarios SET? WHERE id_usuario = ${id_usuario}`, data, (error, result) => {
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function consultacorreo(correo){
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT * from usuarios WHERE correo = '${correo}'`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function usuariosRol(){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_usuariosRol()`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION DE  TALLER
function informaciontaller(id_usuario){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_informaciontaller(${id_usuario})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function UpdateDataParcial(id_taller, data){
    return new Promise((resolve, reject) =>{
        conexion.query(`UPDATE taller SET? WHERE id_taller = ${id_taller}`, data, (error, result) => {
            return error ? reject(error) : resolve(result)
        })
    })
}

// INFORMACION DE EMPRESAS
function empresasTaller(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_empresasTaller(${id_taller})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function existeEmpresa(id_taller, empresa){
    return new Promise((resolve, reject) =>{
        conexion.query(`select * from empresas where id_taller = ${id_taller} and empresa = '${empresa}'`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}

// INFORMACION MO REFACCIONES
function morefaccionesTaller(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_morefaccionesTaller(${id_taller})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function moRefacciones(data){
    const {id_taller, id_sucursal, limit, offset } = data
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL spPaginacionmorefacciones(${id_taller},${id_sucursal},${limit},${offset})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}
function totalMoRefacciones(data){
    const {id_taller, id_sucursal} = data
    return new Promise((resolve, reject) =>{
        conexion.query(`SELECT COUNT(*) as total FROM morefacciones WHERE id_taller = ${id_taller}`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}

// INFORMACION DE PAQUETES
function paquetesTaller(id_taller){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_paquetes(${id_taller})`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION DE PAGOSTALLER
function pagosTaller(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_pagosOrdenesTaller(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION GASTOSORDEN
function gastosOrdenTaller(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOrdenesTaller(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION GASTOSOPERACION TALLER
function gastosOperacionTaller(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOperacionTaller(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION RECEPCIONES TALLER SUCURSAL
function recepcionesTallerSucursal(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_recepcionesTallerSucursal(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION GASTOS OPERACION
function gastosOperacionTallerReporte(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOperacionTallerReporte(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
function sp_gastosOperacion(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_gastosOperacion(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}
// INFORMACION GASTOS OPERACION
function depositosTallerSucursal(id_taller, id_sucursal, start, end){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_depositosTallerSucursal(${id_taller}, ${id_sucursal},'${start}','${end}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result)
        })
    })
}

// CORREOS
function correosClientes(correo){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_correoSearch('${correo}')`, (error, result) =>{ 
            return error ? reject(error) : resolve(result[0])
        })
    })
}

// TECNICOS
function sp_tecnicosTallerSucursal(id_taller, id_sucursal){
    return new Promise((resolve, reject) =>{
        conexion.query(`CALL sp_tecnicosTallerSucursal(${id_taller}, ${id_sucursal})`
        , (error, result) =>{ return error ? reject(error) : resolve(result[0]) })
    })
}

module.exports = {
    recepcionesCliente,
    correosClientes,
    cotizacionesCliente,
    serviciosEntregado,
    clienteUnico,
    contador,
    clientes,
    clientesSucursal,
    contadorClientesUsuario,
    cliente,
    Todos,
    uno,
    agregar,
    eliminar,
    eliminarQuery,
    query,
    pagoRecepcion,
    queryEliminar,
    eliminaEleModPaqRecep,
    consultaModeloMarca,
    VehiculosRelacionados,
    vehiculosCliente,
    getCompatibles,
    sucursalesEmpresas,
    consultaCotizaciones,
    consultaCotizacion,
    vehiculoUnico,
    patchDataCotizacion,
    elementos_cotizaciones,
    RecepcionConsulta,
    RecepcionesVehiculoConsulta,
    seriviciosAceptados,
    RecepcionElementos,
    ObtenerDetallePaquete,
    consultaPaquetes,
    ObtenerDetallePaqueteModificado,
    ObtenerDetallePaqueteModificadoRecep,
    gastosRecepcionUnica,
    PagosRecepcionUnica,
    listaTecnicos,
    plancliente,
    dataUsuario,
    sucursalesTaller,
    sucursalesTaller2,
    patchDataSucursal,
    sucursalUnica,
    updateDataUsuario,
    consultacorreo,
    usuariosRol,
    informaciontaller,
    empresasTaller,
    clientesTallerSucursal,
    verificaPlacas,
    vehiculosTallerSucursal,
    morefaccionesTaller,
    paquetesTaller,
    pagosTaller,
    gastosOrdenTaller,
    gastosOperacionTaller,
    recepcionesTaller,
    patchRecepcion,
    recepcionesTaller2,
    recepcionesTallerSucursal,
    gastosOperacionTallerReporte,
    depositosTallerSucursal,
    sp_gastosOrdenEspecifica,
    sp_ordenesAbiertas,
    sp_pagosTallerSucursal,
    sp_gastosOperacion,
    sp_gastosOrdenesTallerSucursal,
    sp_tecnicosTallerSucursal,
    pagoTotal,
    uno2,
    UpdateDataParcial,
    semejantesmorefacciones,
    semejantesClientes,
    clientesPaginacionTotales,
    clientesPaginacionClientes,
    vehiculosPaginacion,
    updateKilometraje,
    VehiculosPaginacionTotales,
    totalPaquetes,
    busquedaLikePaquetes,
    moRefacciones,
    totalMoRefacciones,
    semejantesVehiculos,
    registraElementosPaquetes,
    existeEmpresa
}