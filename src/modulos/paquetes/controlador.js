
const TABLA = 'paquetes'


module.exports = function (dbIyectada){

    let db = dbIyectada

    if (!db) {
        db = require('../../DB/mysql')
    }

    function todos(){
        return db.consultaPaquetes()
    }
    function uno(id_categoria){
        return db.query(TABLA, {id_categoria})
        return db.uno(TABLA, id)
    }
    function agregar(body){
        return db.agregar(TABLA, body)
    }
    function eliminar(body){
        return db.eliminar(TABLA, body)
    }
    function ObtenerDetallePaquete(id_paquete){
        return db.ObtenerDetallePaquete(id_paquete)
    }

    return {
        todos,
        uno,
        agregar,
        eliminar,
        ObtenerDetallePaquete
    }
    
}