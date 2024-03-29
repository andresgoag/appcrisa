import os
import ast
import bcrypt

from datetime import datetime, timedelta
from flask import Flask, render_template, request, redirect, url_for, flash, session
from db import db
from models.clientes import ClientesModel
from models.prendas import PrendasModel
from models.ordenes import OrdenesModel
from models.user import UserModel
from models.tiempos import TiemposModel
from models.config import (
    ConfigPrendasModel,
    ConfigAreasModel,
    ConfigCategoriaEnvioModel,
    ConfigEmpresaEnvioModel,
    ConfigOpcionesEnvioModel,
    ConfigMediosCompraModel,
    ConfigMarcasModel,
    ConfigEstadosOrdenModel,
    ConfigMediosPagoModel,
    ConfigTallasModel,
    ConfigSubtipoPrendasModel,
)


app = Flask(__name__)
app.secret_key = "appcrisaapp" 
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI', 'sqlite:///data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

salt = bcrypt.gensalt()


# PRENDAS = ['falda', 'pantalon', 'short', 'buzo', 'camibuzo', 'camiseta', 'croptop', 'camisilla', 'camisa', 'vestido', 'correa', 'medias', 'gorro', 'gafas', 'tapabocas', 'arnes', 'panoleta', 'cobija', 'panties', 'dakimakuras', 'kimono', 'cadena', 'sudadera', 'otro']

# AREAS = ["analisis", "planeacion", "diseno", "impresion", "sublimacion", "corte", "confeccion-preparacion1", "confeccion-preparacion2", "confeccion-terminacion", "calidad", "empaque", "almacen", "ventas"]

# CATEGORIA_ENVIOS = ["24H", "CAT A", "CAT B", "CAT C", "CAT D", "CAT E"]

# EMPRESAS_ENVIO = ["interrapidisimo", "servientrega", "472", "mensajero", "envia", "coordinadora", "deprisa", "tcc", "saferbo", "otro"]

# OPCIONES_ENVIO = ["al cobro", "contado", "contraentrega", "recoge en local"]

# MEDIOS_COMPRA = ["instagram", "whatsapp", "facebook", "etsy", "mercadolibre", "pagina web", "presencial", "amazon", "otro"]

# MARCAS = ["crisa", "river caves", "rosie glam", "fighting", "possession", "artemis", "artemis", "akihabara", "happy banana"]

# ESTADOS_ORDEN = ["analisis", "produccion", "almacen", "despachada", "cerrada", "cancelada", "cambios", "reembolso"]

# MEDIOS_PAGO = ["nequi", "bancolombia consignacion", "bancolombia transferencia", "daviplata", "efecty", "gana", "baloto", "giro-otro", "davivienda", "payu", "paypal", "mercadopago", "western union", "efectivo", "nomina", "movil", "datafono", "otro"]

# TALLAS = ["Talla unica", "junior", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "Personalizada"]




@app.before_first_request
def first_run():
    db.create_all()

    usuario = UserModel.find_by_usuario("main_admin")

    if not usuario:
        usuario = "main_admin"
        password = bcrypt.hashpw("appcrisa1029$".encode("utf-8"), salt)
        role = "administrador"
        area = "administrador"
        admin = UserModel(usuario, password, role, area)
        admin.save_to_db()


# Rest API

@app.route('/guardarorden', methods=['POST'])
def guardar_orden():

    data = request.form

    # Guardar datos del cliente
    tipo = data['cliente_categoria']
    nombre = data['cliente_nombre']
    correo = data['cliente_correo']
    tipodoc = data['cliente_tipodoc']
    cedula = data['cliente_cedula']
    telefono = data['cliente_telefono']
    direccion = data['cliente_direccion']
    barrio = data['cliente_barrio']
    ciudad = data['cliente_ciudad']
    departamento = data['cliente_departamento']
    pais = data['cliente_pais']
    codigo_postal = data['cliente_postal']

    cliente = ClientesModel.find_by_cedula(cedula)

    if cliente:
        cliente.tipo = tipo
        cliente.nombre = nombre
        cliente.correo = correo
        cliente.tipodoc = tipodoc
        cliente.cedula = cedula
        cliente.telefono = telefono
        cliente.direccion = direccion
        cliente.barrio = barrio
        cliente.ciudad = ciudad
        cliente.departamento = departamento
        cliente.pais = pais
        cliente.codigo_postal = codigo_postal
        cliente.save_to_db()
        cliente_id = cliente.id
    else:
        cliente = ClientesModel(tipo, nombre, correo, tipodoc, cedula, telefono, direccion, barrio, ciudad, departamento, pais, codigo_postal)
        cliente.save_to_db()
        cliente = ClientesModel.find_by_cedula(cedula)
        cliente_id = cliente.id


    # Registro del numero de orden
    user = session['user']
    numero_orden = data['numero_orden']

    if request.form.get('prioritaria') == "orden_prioritaria":
        prioridad = 'si'
    else:
        prioridad = 'no'
    
    flash(numero_orden, 'orden')
    estado_orden = data['estado_orden']
    opcion_envio = data['opcion_envio']
    if request.form.get('incluir_envio') == "incluir_envio":
        incluir_envio = 'si'
        empresa_envio = data['empresa_envio']
        precio_envio = data['precio_envio']
        guia_envio = data['guia_envio']
    else:
        incluir_envio = "no"
        empresa_envio = ""
        precio_envio = ""
        guia_envio = ""

    abono = data['abono']
    precio_total = data['precio_total']
    marca = data['marca']
    medio_compra = data['medio_compra']
    tiempo_estimado = data['tiempo_estimado']
    forma_pago = data['forma_pago']
    if request.form.get('pagado') == "pagado":
        pagado = 'si'
    else:
        pagado = 'no'
    comentarios = data['comentario']

    orden = OrdenesModel.find_by_orden(numero_orden)

    if orden:
        orden.numero_orden = numero_orden

        if estado_orden != 'despachada':
            orden.estado_orden = estado_orden

        if estado_orden == 'despachada':
            if orden.pagado == 'si':
                orden.estado_orden = estado_orden
            else:
                flash(f"La orden {numero_orden} aun no ha sido pagada, aun no puede ser despachada", 'error')

        orden.user = user
        orden.prioridad = prioridad
        orden.incluir_envio = incluir_envio
        orden.opcion_envio = opcion_envio
        orden.empresa_envio = empresa_envio
        orden.precio_envio = precio_envio
        orden.guia_envio = guia_envio
        orden.abono = abono
        orden.precio_total = precio_total
        orden.marca = marca
        orden.medio_compra = medio_compra
        orden.forma_pago = forma_pago
        orden.pagado = pagado
        orden.comentarios = comentarios
        orden.cliente_id = cliente_id
        orden.tiempo_estimado = tiempo_estimado
        orden.save_to_db()
        flash(f"Orden {numero_orden} actualizada exitosamente", 'success')
        orden_id = orden.id

    else:
        orden = OrdenesModel(user,numero_orden, prioridad, estado_orden, incluir_envio, opcion_envio, empresa_envio, precio_envio, guia_envio, abono, precio_total, marca, medio_compra, forma_pago, pagado, comentarios, cliente_id, tiempo_estimado)
        orden.save_to_db()
        flash(f"Orden {numero_orden} creada exitosamente", 'success')
        orden = OrdenesModel.find_by_orden(numero_orden)
        orden_id = orden.id



    # Guardar registro de las prendas de la orden
    data_keys = data.keys()
    prendas_index = list()
    for i in data_keys:
        if 'tipo' in i and 'sub' not in i and 'doc' not in i:
            prendas_index.append(i)

    for i in prendas_index:
        index = i[-1]

        id_prenda = data[f'id_{index}']
        tipo_prenda = data[f'tipo_{index}']
        subtipo = data[f'subtipo_{index}']
        genero = data[f'genero_{index}']
        talla = data[f'talla_{index}']
        imagen = data[f'imagen_{index}']
        precio = data[f'precio_{index}']
        cantidad = data[f'cantidad_{index}']
        especificacion = data[f'especificacion_{index}']

        if id_prenda == "":
            prenda = PrendasModel(tipo_prenda, subtipo, genero, talla, imagen, precio, cantidad, especificacion, orden_id)
            prenda.save_to_db()
        else:
            id_prenda = int(id_prenda)
            prenda = PrendasModel.find_by_id(id_prenda)
            prenda.tipo_prenda = tipo_prenda
            prenda.subtipo = subtipo
            prenda.genero = genero
            prenda.talla = talla
            prenda.imagen = imagen
            prenda.precio = precio
            prenda.cantidad = cantidad
            prenda.especificacion = especificacion
            prenda.save_to_db()

    return redirect(url_for('ordenes'))

@app.route('/guardarordendiseno', methods=['POST'])
def guardar_orden_diseno():

    data = request.form

    # Guardar datos del cliente
    tipo = "interna"
    nombre = "interna"
    correo = "interna"
    tipodoc = "interna"
    cedula = "interna"
    telefono = "interna"
    direccion = "interna"
    barrio = "interna"
    ciudad = "interna"
    departamento = "interna"
    pais = "interna"
    codigo_postal = "interna"

    cliente = ClientesModel.find_by_cedula(cedula)

    if cliente:
        cliente.tipo = tipo
        cliente.nombre = nombre
        cliente.correo = correo
        cliente.tipodoc = tipodoc
        cliente.cedula = cedula
        cliente.telefono = telefono
        cliente.direccion = direccion
        cliente.barrio = barrio
        cliente.ciudad = ciudad
        cliente.departamento = departamento
        cliente.pais = pais
        cliente.codigo_postal = codigo_postal
        cliente.save_to_db()
        cliente_id = cliente.id
    else:
        cliente = ClientesModel(tipo, nombre, correo, tipodoc, cedula, telefono, direccion, barrio, ciudad, departamento, pais, codigo_postal)
        cliente.save_to_db()
        cliente = ClientesModel.find_by_cedula(cedula)
        cliente_id = cliente.id


    # Registro del numero de orden
    user = session['user']
    numero_orden = data['numero_orden']
    flash(numero_orden, 'orden')
    prioridad = 'no'
    estado_orden = data['estado_orden']
    opcion_envio = "interna"
    incluir_envio = "no"
    empresa_envio = "interna"
    precio_envio = "interna"
    guia_envio = "interna"

    abono = "interna"
    precio_total = "interna"
    marca = "interna"
    medio_compra = "interna"
    tiempo_estimado = "interna"
    forma_pago = "interna"
    pagado = 'no'
    comentarios = data['comentario']

    orden = OrdenesModel.find_by_orden(numero_orden)

    if orden:
        orden.numero_orden = numero_orden
        orden.estado_orden = estado_orden
        orden.user = user
        orden.prioridad = prioridad
        orden.incluir_envio = incluir_envio
        orden.opcion_envio = opcion_envio
        orden.empresa_envio = empresa_envio
        orden.precio_envio = precio_envio
        orden.guia_envio = guia_envio
        orden.abono = abono
        orden.precio_total = precio_total
        orden.marca = marca
        orden.medio_compra = medio_compra
        orden.forma_pago = forma_pago
        orden.pagado = pagado
        orden.comentarios = comentarios
        orden.cliente_id = cliente_id
        orden.tiempo_estimado = tiempo_estimado
        orden.save_to_db()
        flash(f"Orden {numero_orden} actualizada exitosamente", 'success')
        orden_id = orden.id

    else:
        orden = OrdenesModel(user,numero_orden, prioridad, estado_orden, incluir_envio, opcion_envio, empresa_envio, precio_envio, guia_envio, abono, precio_total, marca, medio_compra, forma_pago, pagado, comentarios, cliente_id, tiempo_estimado)
        orden.save_to_db()
        flash(f"Orden {numero_orden} creada exitosamente", 'success')
        orden = OrdenesModel.find_by_orden(numero_orden)
        orden_id = orden.id


    # Guardar registro de las prendas de la orden
    data_keys = data.keys()
    prendas_index = list()
    for i in data_keys:
        if 'especificacion' in i:
            prendas_index.append(i)

    for i in prendas_index:
        index = i[-1]

        id_prenda = data[f'id_{index}']
        tipo_prenda = "interna"
        subtipo = "interna"
        genero = "interna"
        talla = "interna"
        imagen = "interna"
        precio = "interna"
        cantidad = "interna"
        especificacion = data[f'especificacion_{index}']

        if id_prenda == "":
            prenda = PrendasModel(tipo_prenda, subtipo, genero, talla, imagen, precio, cantidad, especificacion, orden_id)
            prenda.area_responsable = "diseno"
            prenda.save_to_db()
        else:
            id_prenda = int(id_prenda)
            prenda = PrendasModel.find_by_id(id_prenda)
            prenda.tipo_prenda = tipo_prenda
            prenda.subtipo = subtipo
            prenda.genero = genero
            prenda.talla = talla
            prenda.imagen = imagen
            prenda.precio = precio
            prenda.cantidad = cantidad
            prenda.especificacion = especificacion
            prenda.save_to_db()

    return redirect(url_for('ordenes'))

@app.route('/crearnumerodeorden')
def new_order():
    utc_date = datetime.now()
    col_date = utc_date - timedelta(hours=5)
    fecha = col_date.strftime("%y%m%d%H%M%S")
    return {'numero_orden': fecha}

@app.route('/getuser/<string:cedula>')
def get_user(cedula):
    cliente = ClientesModel.find_by_cedula(cedula)
    if cliente:
        return cliente.json()
    else:
        return {"message":"Usuario no enconotrado"}, 400

@app.route('/getorder/<string:order>')
def get_order(order):
    orden = OrdenesModel.find_by_orden(order)
    if orden:
        return orden.json()
    else:
        return {"message":"Orden no encontrada"}, 400

@app.route('/borrarprenda/<int:prenda_id>', methods=['DELETE'])
def borrar_prenda(prenda_id):
    prenda_id = int(prenda_id)
    prenda = PrendasModel.find_by_id(prenda_id)
    if prenda:
        prenda.delete_from_db()
        return{"message":"Prenda eliminada con exito"}
    return{"message":"No se encontro la prenda con el id"+prenda_id}

@app.route('/borrarusuario', methods=['POST'])
def borrar_usuario():
    data = request.form
    usuario = data['eliminar-usuario']
    user = UserModel.find_by_usuario(usuario)
    if user:
        user.delete_from_db()
        flash("Usuario eliminado con exito", "success")
    else:
        flash("Usuario no encontrado", "error")
    return redirect(url_for('configuracion'))

@app.route('/borrarorden', methods=['POST'])
def borrar_orden():
    data = request.form
    numero_orden = data['eliminar-orden']

    orden = OrdenesModel.find_by_orden(numero_orden)
    if orden:
        orden.delete_from_db()
        flash("Orden eliminada exitosamente", "success")

    else:
        flash("Orden no encontrada", "error")
    return redirect(url_for('configuracion'))

@app.route('/actualizarestadoorden', methods=["POST"])
def actualizar_estado_orden():

    data = request.form
    flash(data['numero_orden'], 'orden')
    order = OrdenesModel.find_by_orden(data['numero_orden'])

    if data['estado_orden'] == "almacen":
        flag = True
        for prenda in order.prendas:
            if prenda.empacado == "no":
                flash(f"La orden {data['numero_orden']} tiene prendas pendientes por empacar", "error")
                flag = False
                break
        if flag:
            order.estado_orden = data['estado_orden']
            order.save_to_db()
            flash("Estado actualizado exitosamente", 'success')


    elif data['estado_orden'] == 'despachada':
        if order.estado_orden == "almacen":
            if order.pagado == 'si':
                order.estado_orden = data['estado_orden']
                order.save_to_db()
                flash("Estado actualizado exitosamente", 'success')
            else:
                flash(f"La orden {data['numero_orden']} aun no ha sido pagada, aun no puede ser despachada", 'error')
        else:
            flash(f"La orden {data['numero_orden']} no se encuentra en almacen", 'error')

    elif data['estado_orden'] == 'cerrada':

        for prenda in order.prendas:
            prenda_model = PrendasModel.find_by_id(prenda.id)
            prenda_model.user_responsable = ""
            prenda_model.save_to_db()

        order.estado_orden = data['estado_orden']
        order.save_to_db()
        flash("Estado actualizado exitosamente", 'success')


    else:
        order.estado_orden = data['estado_orden']
        order.save_to_db()
        flash("Estado actualizado exitosamente", 'success')


    return redirect(url_for('produccion'))

@app.route('/actualizardespacho', methods=["POST"])
def actualizar_despacho():

    data = request.get_json()
    order = OrdenesModel.find_by_orden(data['numero_orden'])
    print('2')
    if data['estado_orden'] == 'despachada':
        print('3')
        if order.estado_orden == "almacen":
            print('4')
            if order.pagado == 'si':
                print('5')
                order.estado_orden = data['estado_orden']
                order.save_to_db()
                return {"message":"Estado actualizado exitosamente"}
            else:
                return{"message":f"La orden {data['numero_orden']} aun no ha sido pagada, aun no puede ser despachada"}
        else:
            return{"message":f"La orden {data['numero_orden']} no se encuentra en almacen"}

    return {"message":"La orden no se marco como despachada"}

@app.route('/logout')  
def logout():  
    if 'user' in session:  
        session.pop('user',None)  
        return redirect(url_for('home'))

@app.route('/tiempos', methods=['POST'])
def cargar_tiempos():
    data = request.get_json()
    prenda = PrendasModel.find_by_id(data['id_prenda'])
    user = UserModel.find_by_usuario(session['user'])
    tiempos = TiemposModel.find_by_prendayusuario(prenda.id, user.id)
    
    if tiempos:
        tiempo = False
        for i in tiempos:
            if i.final == "":
                tiempo = i
                break
        
        if tiempo:
            tiempo.final = (datetime.now() - timedelta(hours=5)).strftime("%Y %m %d %H %M %S")
            tiempo.save_to_db()
        else:
            tiempo = TiemposModel(user.id, prenda.orden_id, prenda.id, session['area'])
            tiempo.save_to_db()

    else:
        tiempo = TiemposModel(user.id, prenda.orden_id, prenda.id, session['area'])
        tiempo.save_to_db()

    return tiempo.json()

@app.route('/verificartiempos/<string:order>')
def verificar_tiempos(order):
    user = UserModel.find_by_usuario(session['user'])
    orden = OrdenesModel.find_by_orden(order)
    if orden:

        tiempos = TiemposModel.find_by_ordenyusuario(orden.id, user.id)
        y = list()
        for tiempo in tiempos:
            if tiempo.final == "":
                y.append(tiempo.json())

        return {"tiempos_abiertos":y}

    else:
        return {"message":"Orden no encontrada"}

@app.route('/casoproduccion', methods=['POST'])
def casoproduccion():
    data = request.get_json()
    prenda = PrendasModel.find_by_id(data['id'])

    if prenda:
        if prenda.caso_produccion != data['caso']:
            prenda.caso_produccion = data['caso']
            estados_produccion = dict()
            for estado in data['estados']:
                estados_produccion[estado] = 0
            prenda.estados_produccion = str(estados_produccion)
            prenda.area_responsable = data["area_inicial"]
            prenda.save_to_db()
            return {'message':'Actualizado con exito', "estados_produccion":prenda.estados_produccion}
        else:
            return {'message':'El caso actual seleccionado es el mismo'}
    
    return {'message':'Prenda no encontrada'}

@app.route('/marcarproduccion', methods=['POST'])
def marcarproduccion():
    data = request.get_json()
    prenda = PrendasModel.find_by_id(data["id_prenda"])

    if prenda:
        estados_produccion = ast.literal_eval(prenda.estados_produccion)
        if data["estado"]:
            estados_produccion[data["area"]] = 1
            prenda.estados_produccion = str(estados_produccion)
            prenda.save_to_db()
            return {"message":"Estado actualizado exitosamente", "status":"ok"}

        else:
            return {"message":"Servicio no disponible", "status":""}

    else:
        return {"message":"Servicio no disponible", "status":""}

@app.route('/getprendaestado/<int:prenda_id>')
def getprendaestado(prenda_id):
    prenda = PrendasModel.find_by_id(prenda_id)
    if prenda:
        return{"estados":prenda.json()["estados_produccion"]}
    else:
        return {"message":"prenda no encontrada"}

@app.route('/crearusuario', methods=["POST"])
def crear_usuario():
    data = request.form
    usuario = data['input-nuevo-usuario']
    password = bcrypt.hashpw(data["input-nuevo-usuario-password"].encode("utf-8"), salt)
    role = data["input-nuevo-usuario-role"]
    area = data["input-nuevo-usuario-area"]

    user = UserModel.find_by_usuario(usuario)

    if user:
        flash(f"El usuario {usuario} ya existe, por favor seleccione otro nombre de usuario", "error")
        return(redirect(url_for('configuracion')))

    else:
        user = UserModel(usuario, password, role, area)
        try:
            user.save_to_db()
            flash(f"Usuario {usuario} creado con éxito", "success")
            return(redirect(url_for('configuracion')))
        except:
            flash(f"Error al crear el usuario {usuario}, por favor intentelo nuevamente", "error")
            return(redirect(url_for('configuracion')))

@app.route('/modificarusuario', methods=["POST"])
def modificar_usuario():
    data = request.form

    usuario = data['modificar-usuario']
    password = bcrypt.hashpw(data["modificar-password"].encode("utf-8"), salt)
    role = data["modificar-role"]
    area = data["modificar-area"]

    user = UserModel.find_by_usuario(usuario)

    if user:
        user.password = password
        user.role = role
        user.area = area
        try:
            user.save_to_db()
            flash(f"Usuario {usuario} actualizado exitosamente", "success")
            return(redirect(url_for('configuracion')))
        except:
            flash(f"Error al actualizar el usuario {usuario}, por favor intentelo nuevamente", "error")
            return(redirect(url_for('configuracion')))

    else:
        flash("Usuario no encontrado", "error")
        return(redirect(url_for('configuracion')))

@app.route('/arearesponsableprenda', methods=["POST"])
def area_responsable_prenda():
    data = request.get_json()
    prenda = PrendasModel.find_by_id(data["id_prenda"])
    if prenda:
        prenda.area_responsable = data["area"]
        prenda.save_to_db()
        return {"message":f"Se asigno exitosamente a {data['area']}"}
    else:
        return {"message":"Error al asignar área, por favor recargue la página e inténtelo nuevamente"}

@app.route('/usuarioresponsableprenda', methods=["POST"])
def usuario_responsable_prenda():
    data = request.get_json()
    prenda = PrendasModel.find_by_id(data["id_prenda"])
    if prenda:
        usuario = UserModel.find_by_usuario(data["usuario"])

        if usuario:
            
            if usuario.area == data['area']:
                prenda.user_responsable = data["usuario"]
                prenda.save_to_db()
                return {"message": f"Se asigno exitosamente a {data['usuario']}"}
            
            return {'message': f'El usuario seleccionado no es del area {data["area"]}'}
        
        else:
            return {"message": f"el usuario {data['usuario']} no existe"}
            
    else:
        return {"message": "Error al asignar usuario, por favor recargue la página e inténtelo nuevamente"}

@app.route('/cambiarusuariovacio/<int:prenda_id>')
def cambiar_usuario_vacio(prenda_id):

    prenda = PrendasModel.find_by_id(prenda_id)
    if prenda:

        prenda.user_responsable = ""
        try:
            prenda.save_to_db()
            return {"message": "Usuarios desasignados exitosamente"}
        except:
            return {"message": "Servidor no disponible"}
            
    else:
        return {"message": "prenda no encontrada"}

@app.route('/verordenes')
def ver_ordenes():
    x = OrdenesModel.find()
    y = list()
    for i in x:
        y.append(i.json())
    return {'ordenes':y}

@app.route('/verordenesbydate', methods=['POST'])
def ver_ordenes_by_date():
    data = request.get_json()

    if data["desde"] and data['hasta']:
        desde = datetime.strptime(data["desde"], "%Y-%m-%d")
        hasta = datetime.strptime(data["hasta"], "%Y-%m-%d")
    elif data["desde"] and not data['hasta']:
        desde = datetime.strptime(data["desde"], "%Y-%m-%d")
        hasta = desde + timedelta(days=100)
    elif data['hasta'] and not data["desde"]:
        hasta = datetime.strptime(data["hasta"], "%Y-%m-%d")
        desde = hasta - timedelta(days=100)
    else:
        utc_date = datetime.now()
        hasta = utc_date - timedelta(hours=5)
        desde = hasta - timedelta(days=100)

    data["desde"] = desde.strftime("%y%m%d%H%M%S")
    data["hasta"] = hasta.strftime("%y%m%d%H%M%S")

    x = OrdenesModel.find_by_date(**data)
    y = list()
    for i in x:
        y.append(i.json())
    return {'ordenes':y}

@app.route('/vertiempos')
def ver_tiempos():
    x = TiemposModel.find()
    y = dict()
    cont = 1
    for i in x:
        y[cont] = i.json()
        cont = cont + 1
    return y

@app.route('/get_tiempos', methods=['POST'])
def get_tiempos():
    data = request.get_json()
    utc_date = datetime.now()
    col_date = utc_date - timedelta(hours=5)
    default_min_date = col_date - timedelta(days=100)

    if data["desde"]:
        data["desde"] = datetime.strptime(data["desde"], "%Y-%m-%d")
    else:
        data["desde"] = default_min_date

    if data["hasta"]:
        data["hasta"] = datetime.strptime(data["hasta"], "%Y-%m-%d")
    else:
        data["hasta"] = col_date

    try:
        if data['orden']:
            data['orden'] = OrdenesModel.find_by_orden(data['orden']).id

        if data['usuario']:
            data['usuario'] = UserModel.find_by_usuario(data['usuario']).id
    except:
        return {"tiempos": []}

    x = TiemposModel.find_query(data['orden'], data['usuario'], data['area'])
    y = list()
    for i in x:
        prenda = i.prenda.tipo
        if data["prenda"] == "" or prenda == data['prenda']:
            inicio = datetime.strptime(i.inicio, "%Y %m %d %H %M %S")
            if inicio <= data['hasta'] and inicio >= data["desde"]:
                final = ""
                tiempo = ""
                if i.final != "": 
                    final = datetime.strptime(i.final, "%Y %m %d %H %M %S")
                    tiempo = final - inicio
                    hours, remainder = divmod(tiempo.seconds, 3600)
                    minutes, seconds = divmod(remainder, 60)

                item = {
                    "orden": i.orden.numero_orden,
                    "usuario": i.user.usuario,
                    "area": i.area_produccion,
                    "inicio": inicio.strftime("%Y-%m-%d %H:%M:%S"),
                    "final": final.strftime("%Y-%m-%d %H:%M:%S"),
                    "prenda": prenda,
                    "tiempo": tiempo.seconds,
                    "tiempo_str": f"{hours}:{minutes}:{seconds}"
                }
                y.append(item)
    return {"tiempos":y}

@app.route('/getsession')
def getsession():

    if 'user' in session:
        return {
            "usuario": session['user'],
            "role": session['role'],
            "area": session['area'],
            "message": "success"
        }
    else:
        return {"message":"none"}

@app.route('/getuserinfo')
def getuserinfo():

    data = request.form
    usuario = data['input-nuevo-usuario']
    password = bcrypt.hashpw(data["input-nuevo-usuario-password"].encode("utf-8"), salt)
    role = data["input-nuevo-usuario-role"]
    area = data["input-nuevo-usuario-area"]

    user = UserModel.find_by_usuario(usuario)

    if user:
        flash(f"El usuario {usuario} ya existe, por favor seleccione otro nombre de usuario", "error")
        return(redirect(url_for('configuracion')))

    else:
        user = UserModel(usuario, password, role, area)
        try:
            user.save_to_db()
            flash(f"Usuario {usuario} creado con éxito", "success")
            return(redirect(url_for('configuracion')))
        except:
            flash(f"Error al crear el usuario {usuario}, por favor intentelo nuevamente", "error")
            return(redirect(url_for('configuracion')))

@app.route('/agregarcomentario', methods=["POST"])
def agregar_comentario():
    data = request.get_json()
    nuevo_comentario = data['comentario']
    
    prenda = PrendasModel.find_by_id(data['id'])

    if prenda:
        prenda.especificacion = prenda.especificacion +" >>> "+ nuevo_comentario
        try:
            prenda.save_to_db()
            return {"message": "ok", "especificacion": prenda.especificacion}
        except:
            return {"message":"Error en el servidor"}
    else:
        return {"message":"prenda no encontrada"}

@app.route('/modificarcomentario', methods=["POST"])
def modificar_comentario():
    data = request.get_json()
    nuevo_comentario = data['comentario']
    
    prenda = PrendasModel.find_by_id(data['id'])

    if prenda:
        prenda.especificacion = nuevo_comentario
        try:
            prenda.save_to_db()
            return {"message": "ok", "especificacion": prenda.especificacion}
        except:
            return {"message":"Error en el servidor"}
    else:
        return {"message":"prenda no encontrada"}

@app.route('/marcarpago', methods=["POST"])
def marcar_pago():
    data = request.get_json()

    orden = OrdenesModel.find_by_orden(data['orden'])

    if orden:
        if data['estado']:
            orden.pagado = "si"
            orden.abono = orden.precio_total
        else:
            orden.pagado = "no"
            orden.abono = ""
        
        try:
            orden.save_to_db()
            return {"message":"actualizado exitosamente"}
        except:
            return{"message":"Servidor no disponible, intentelo mas tarde"},500
    else:
        return {"message":"Orden no encontrada"},400

@app.route('/marcarempaque', methods=['POST'])
def marcar_empaque():

    data = request.get_json()

    prenda = PrendasModel.find_by_id(data['prenda_id'])

    if prenda:
        if data['estado']:
            prenda.empacado = "si"
            prenda.area_responsable = ""
        else:
            prenda.empacado = "no"
            prenda.area_responsable = "empaque"

        try:
            prenda.save_to_db()
            return {"message":"Actualizado exitosamente"}

        except:
            return {"message":"Servidor no disponible, intente nuevamente"}

    
    return {"message":"Prenda no encontrada"}

def config_add_item(item, cls):
    nuevo_item = cls.find_one(item)

    if nuevo_item:
        flash(f"El item {item} ya existe", "error")
        return False

    nuevo_item = cls(item)
    try:
        nuevo_item.save_to_db()
        flash(f"Item {item} creada exitosamente", "success")
        return True

    except:
        flash("Error interno del servidor, vuelva a intentarlo", "error")
        return False

def config_get_items(cls):
    items_list = []
    items = cls.find()

    for item in items:
        item_json = item.json()
        items_list.append(item_json.get("item"))

    return {"items": items_list}

@app.route("/config_addprenda", methods=['POST'])
def config_addprenda():
    item = request.form.get("item").strip().lower()
    result = config_add_item(item, ConfigPrendasModel)
    return redirect(url_for('configuracion'))

@app.route("/config_getprendas")
def config_get_prendas():
    return config_get_items(ConfigPrendasModel)

@app.route("/config_addareas", methods=['POST'])
def config_addareas():
    item = request.form.get("item").strip().lower()
    result = config_add_item(item, ConfigAreasModel)
    return redirect(url_for('configuracion'))

@app.route("/config_getareas")
def config_get_areas():
    return config_get_items(ConfigAreasModel)

@app.route("/config_addcategoriaenvio", methods=['POST'])
def config_addcategoriaenvio():
    item = request.form.get("item").strip().lower()
    result = config_add_item(item, ConfigCategoriaEnvioModel)
    return redirect(url_for('configuracion'))

@app.route("/config_getcategoriaenvio")
def config_get_categoriaenvio():
    return config_get_items(ConfigCategoriaEnvioModel)

@app.route("/config_addempresaenvio", methods=['POST'])
def config_addempresaenvio():
    item = request.form.get("item").strip().lower()
    result = config_add_item(item, ConfigEmpresaEnvioModel)
    return redirect(url_for('configuracion'))

@app.route("/config_getempresaenvio")
def config_get_empresaenvio():
    return config_get_items(ConfigEmpresaEnvioModel)

@app.route("/config_addopcionesenvio", methods=['POST'])
def config_addopcionesenvio():
    item = request.form.get("item").strip().lower()
    result = config_add_item(item, ConfigOpcionesEnvioModel)
    return redirect(url_for('configuracion'))

@app.route("/config_getopcionesenvio")
def config_get_opcionesenvio():
    return config_get_items(ConfigOpcionesEnvioModel)

@app.route("/config_addmedioscompra", methods=['POST'])
def config_addmedioscompra():
    item = request.form.get("item").strip().lower()
    result = config_add_item(item, ConfigMediosCompraModel)
    return redirect(url_for('configuracion'))

@app.route("/config_getmedioscompra")
def config_get_medioscompra():
    return config_get_items(ConfigMediosCompraModel)

@app.route("/config_addmarcas", methods=['POST'])
def config_addmarcas():
    item = request.form.get("item").strip().lower()
    result = config_add_item(item, ConfigMarcasModel)
    return redirect(url_for('configuracion'))

@app.route("/config_getmarcas")
def config_get_marcas():
    return config_get_items(ConfigMarcasModel)

@app.route("/config_addestadosorden", methods=['POST'])
def config_addestadosorden():
    item = request.form.get("item").strip().lower()
    result = config_add_item(item, ConfigEstadosOrdenModel)
    return redirect(url_for('configuracion'))

@app.route("/config_getestadosorden")
def config_get_estadosorden():
    return config_get_items(ConfigEstadosOrdenModel)

@app.route("/config_addmediospago", methods=['POST'])
def config_addmediospago():
    item = request.form.get("item").strip().lower()
    result = config_add_item(item, ConfigMediosPagoModel)
    return redirect(url_for('configuracion'))

@app.route("/config_getmediospago")
def config_get_mediospago():
    return config_get_items(ConfigMediosPagoModel)

@app.route("/config_addtallas", methods=['POST'])
def config_addtallas():
    item = request.form.get("item").strip().lower()
    result = config_add_item(item, ConfigTallasModel)
    return redirect(url_for('configuracion'))

@app.route("/config_gettallas")
def config_get_tallas():
    return config_get_items(ConfigTallasModel)

@app.route("/config_addsubtipo", methods=['POST'])
def config_addsubtipo():
    prenda = request.form.get("prenda").strip().lower()
    item = request.form.get("item").strip().lower()
    nuevo_item = ConfigSubtipoPrendasModel.find_one(item)

    if nuevo_item:
        flash(f"El item {item} ya existe", "error")
        return redirect(url_for('configuracion'))

    prenda_obj = ConfigPrendasModel.find_one(prenda)

    if prenda_obj:
        nuevo_item = ConfigSubtipoPrendasModel(item, prenda_obj.id)

        try:
            nuevo_item.save_to_db()
            flash(f"Item {item} creada exitosamente", "success")
            return redirect(url_for('configuracion'))

        except:
            flash("Error interno del servidor, vuelva a intentarlo", "error")
            return redirect(url_for('configuracion'))


        return redirect(url_for('configuracion'))

    flash(f"La prenda {prenda} no existe", "error")
    return redirect(url_for('configuracion'))


@app.route("/config_getsubtipo/<string:prenda>")
def config_get_subtipo(prenda):
    items_list = []
    prenda = ConfigPrendasModel.find_one(prenda)
    if prenda:
        subtipos_obj = ConfigSubtipoPrendasModel.find_by_prenda(prenda.id)
        for subtipo in subtipos_obj:
            items_list.append(subtipo.item)
        
    return {'items': items_list}




# Pagina web

@app.route('/', methods=['GET', 'POST'])
def home():
    print(os.environ.get('DATABASE_URI'))
    if 'user' in session:
        return redirect(url_for('ordenes'))
    else:
        if request.method == "POST":
            input_usuario = request.form['usuario']
            input_password = request.form['password'].encode("utf-8")

            usuario = UserModel.find_by_usuario(input_usuario)

            if usuario:
                # password_comparar = bytes.fromhex(usuario.password[2:])
                password_comparar = usuario.password

                if bcrypt.checkpw(input_password, password_comparar):
                    session['user'] = usuario.usuario
                    session['role'] = usuario.role
                    session['area'] = usuario.area

                    return redirect(url_for('ordenes'))

                else:
                    flash("Email o contraseña incorrecta", "error")
                    return render_template('login.html')

            else:
                flash("Email o contraseña incorrecta", "error")
                return render_template('login.html')

        else:
            return render_template('login.html')

@app.route('/ordenes')
def ordenes():

    GLOBAL_CONTEXT = {
        "prendas": config_get_prendas()["items"],
        "areas": config_get_areas()["items"],
        "categorias_envio": config_get_categoriaenvio()["items"],
        "empresas_envio": config_get_empresaenvio()["items"],
        "opciones_envio": config_get_opcionesenvio()["items"],
        "medios_compra": config_get_medioscompra()["items"],
        "marcas": config_get_marcas()["items"],
        "estados_orden": config_get_estadosorden()["items"],
        "medios_pago": config_get_mediospago()["items"],
        "tallas": config_get_tallas()["items"],
    }

    if 'user' in session:

        if session['role'] == "administrador":
            return render_template('ordenes.html', **GLOBAL_CONTEXT)

        elif session['area'] == "ventas":

            if session['role'] == "jefe-area":
                return render_template('ordenes-ventas.html', **GLOBAL_CONTEXT)
            elif session['role'] == "operador":
                return render_template('ordenes-ventas-operarios.html', **GLOBAL_CONTEXT)

        elif session['area'] == "diseno" and session['role'] == 'jefe-area':
            return render_template('ordenes-diseno.html')

        else:
            return redirect(url_for('informes'))

    else:
        return redirect(url_for('home'))

@app.route('/produccion')
def produccion():

    GLOBAL_CONTEXT = {
        "prendas": config_get_prendas()["items"],
        "areas": config_get_areas()["items"],
        "categorias_envio": config_get_categoriaenvio()["items"],
        "empresas_envio": config_get_empresaenvio()["items"],
        "opciones_envio": config_get_opcionesenvio()["items"],
        "medios_compra": config_get_medioscompra()["items"],
        "marcas": config_get_marcas()["items"],
        "estados_orden": config_get_estadosorden()["items"],
        "medios_pago": config_get_mediospago()["items"],
        "tallas": config_get_tallas()["items"],
    }

    if 'user' in session:

        if session['role'] == 'operador':
            if session['area'] == 'ventas':
                return render_template("produccion-ventas.html", **GLOBAL_CONTEXT) #ok

            elif session['area'] == 'almacen':
                return redirect(url_for('informes'))

            elif session['area'] == "analisis":
                return render_template("produccion-analisis.html") #ok

            elif session['area'] == "empaque":
                return render_template("produccion-empaques.html", **GLOBAL_CONTEXT) #ok

            else:
                return render_template("produccion-operarios.html") #ok


        elif session['role'] == 'jefe-area':
            if session['area'] == 'ventas':
                return render_template("produccion-ventas.html", **GLOBAL_CONTEXT) #ok

            elif session['area'] == 'almacen':
                return redirect(url_for('informes'))

            elif session['area'] == "analisis":
                return render_template("produccion-analisis.html") #ok

            elif session['area'] == "empaque":
                return render_template("produccion-empaques-jefe.html", **GLOBAL_CONTEXT) #ok
            
            elif session['area'] == "diseno":
                return render_template("produccion-jefe-diseno.html", **GLOBAL_CONTEXT) #ok
            
            elif session['area'] == "planeacion":
                return render_template("produccion-planeacion.html", **GLOBAL_CONTEXT) #ok

            else:
                return render_template("produccion-jefe.html", **GLOBAL_CONTEXT) #ok


        elif session['role'] == 'administrador':
            return render_template("produccion.html", **GLOBAL_CONTEXT) #ok

        else:
            return{"message":"Role no reconocido"}

    else:
        return redirect(url_for('home'))

@app.route('/informes')
def informes():

    GLOBAL_CONTEXT = {
        "prendas": config_get_prendas()["items"],
        "areas": config_get_areas()["items"],
        "categorias_envio": config_get_categoriaenvio()["items"],
        "empresas_envio": config_get_empresaenvio()["items"],
        "opciones_envio": config_get_opcionesenvio()["items"],
        "medios_compra": config_get_medioscompra()["items"],
        "marcas": config_get_marcas()["items"],
        "estados_orden": config_get_estadosorden()["items"],
        "medios_pago": config_get_mediospago()["items"],
        "tallas": config_get_tallas()["items"],
    }

    if 'user' in session:

        if session['role'] == 'operador':
            if session['area'] == 'ventas':
                return render_template("informes-ventas.html", **GLOBAL_CONTEXT) #ok

            elif session['area'] == 'almacen':
                return render_template("informes-almacen.html", **GLOBAL_CONTEXT)

            elif session['area'] == "analisis":
                return render_template("informes-analisis.html", **GLOBAL_CONTEXT) #ok
            
            elif session['area'] == "empaque":
                return render_template("informes-empaque.html", **GLOBAL_CONTEXT) #ok

            else:
                return render_template("informes-operarios.html", **GLOBAL_CONTEXT) #ok


        elif session['role'] == 'jefe-area':
            if session['area'] == 'ventas':
                return render_template("informes-ventas.html", **GLOBAL_CONTEXT) #ok

            elif session['area'] == 'almacen':
                return render_template("informes-almacen.html", **GLOBAL_CONTEXT)

            elif session['area'] == "analisis":
                return render_template("informes-analisis-jefe.html", **GLOBAL_CONTEXT) #ok

            elif session['area'] == "empaque":
                return render_template("informes-empaque-jefe.html", **GLOBAL_CONTEXT) #ok

            elif session['area'] == "diseno":
                return render_template("informes-jefe-diseno.html", **GLOBAL_CONTEXT) #ok

            else:
                return render_template("informes-jefe.html", **GLOBAL_CONTEXT) #ok


        elif session['role'] == 'administrador':
            return render_template("informes.html", **GLOBAL_CONTEXT) #ok

        else:
            return{"message":"Role no reconocido"}
            
    else:
        return redirect(url_for('home'))

@app.route('/configuracion')
def configuracion():

    GLOBAL_CONTEXT = {
        "prendas": config_get_prendas()["items"],
        "areas": config_get_areas()["items"],
        "categorias_envio": config_get_categoriaenvio()["items"],
        "empresas_envio": config_get_empresaenvio()["items"],
        "opciones_envio": config_get_opcionesenvio()["items"],
        "medios_compra": config_get_medioscompra()["items"],
        "marcas": config_get_marcas()["items"],
        "estados_orden": config_get_estadosorden()["items"],
        "medios_pago": config_get_mediospago()["items"],
        "tallas": config_get_tallas()["items"],
    }

    if 'user' in session:
        if session['role'] == "administrador":
            return render_template("configuracion.html", **GLOBAL_CONTEXT)
        else:
            return redirect(url_for('informes'))
    else:
        return redirect(url_for('home'))

@app.route('/cambiarcontrasena', methods=["POST", "GET"])
def cambiar_contrasena():
    if request.method == "POST":

        data = request.form

        user = UserModel.find_by_usuario(data['usuario'])
        if user:
            password_comparar = bytes.fromhex(user.password[2:])
            if bcrypt.checkpw(data['contrasena-actual'].encode("utf-8"), password_comparar):
                user.password = bcrypt.hashpw(data['contrasena-nueva'].encode("utf-8"), salt)
                try:
                    user.save_to_db()
                except:
                    flash("Error en el servidor, trate nuevamente", "error")
                    return redirect(url_for('home'))

                flash("Contraseña actualizada exitosamente", "success")
                return redirect(url_for('home'))

            else:
                flash("Contraseña incorrecta", "error")
                return redirect(url_for('home'))

        else:
            flash("Usuario no encontrado", "error")
            return redirect(url_for('home'))

    else:
        return render_template('contrasena.html')



if __name__ == "__main__":
    db.init_app(app)
    app.run(host="0.0.0.0", debug = True)
