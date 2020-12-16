import os
import ast
import bcrypt
from datetime import datetime

from flask import Flask, render_template, request, redirect, url_for, flash, session

from models.clientes import ClientesModel
from models.prendas import PrendasModel
from models.ordenes import OrdenesModel
from models.user import UserModel
from models.tiempos import TiemposModel

from db import db


app = Flask(__name__)
app.secret_key = "appcrisaapp" 

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

salt = bcrypt.gensalt()





@app.before_first_request
def first_run():
    db.create_all()

    usuario = UserModel.find_by_usuario("main_admin")
    if not usuario:
        usuario = "main_admin"
        password = bcrypt.hashpw("appcrisa1029$".encode("utf-8"), salt)
        role = "administrador"
        admin = UserModel(usuario, password, role)
        admin.save_to_db()



# Pagina web

@app.route('/', methods=['GET', 'POST'])
def home():
    if 'user' in session:
        return redirect(url_for('ordenes'))
    else:
        if request.method == "POST":
            input_usuario = request.form['usuario']
            input_password = request.form['password'].encode("utf-8")
            password_encrypted = bcrypt.hashpw(input_password, salt)

            usuario = UserModel.find_by_usuario(input_usuario)

            if usuario:
                if bcrypt.checkpw(input_password, usuario.password):
                    session['user'] = usuario.usuario
                    session['role'] = usuario.role
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
    if 'user' in session:
        return render_template('ordenes.html')
    else:
        return redirect(url_for('home'))


@app.route('/produccion')
def produccion():
    if 'user' in session:
        return render_template("produccion.html")
    else:
        return redirect(url_for('home'))


@app.route('/informes')
def informes():
    if 'user' in session:
        return render_template("informes.html")
    else:
        return redirect(url_for('home'))


@app.route('/configuracion')
def configuracion():
    if 'user' in session:
        return render_template("configuracion.html")
    else:
        return redirect(url_for('home'))



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
        orden.save_to_db()
        flash(f"Orden {numero_orden} actualizada exitosamente", 'success')
        orden_id = orden.id

    else:
        orden = OrdenesModel(user,numero_orden, prioridad, estado_orden, incluir_envio, opcion_envio, empresa_envio, precio_envio, guia_envio, abono, precio_total, marca, medio_compra, forma_pago, pagado, comentarios, cliente_id)
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


@app.route('/crearnumerodeorden')
def new_order():
    fecha = datetime.now().strftime("%y%m%d%H%M%S")
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


@app.route('/actualizarestadoorden', methods=["POST"])
def actualizar_estado_orden():

    data = request.form
    flash(data['numero_orden'], 'orden')
    order = OrdenesModel.find_by_orden(data['numero_orden'])

    if data['estado_orden'] != 'despachada':
        order.estado_orden = data['estado_orden']
        order.save_to_db()
        flash("Estado actualizado exitosamente", 'success')

    if data['estado_orden'] == 'despachada':
        if order.pagado == 'si':
            order.estado_orden = data['estado_orden']
            order.save_to_db()
            flash("Estado actualizado exitosamente", 'success')
        else:
            flash(f"La orden {data['numero_orden']} aun no ha sido pagada, aun no puede ser despachada", 'error')

    return redirect(url_for('produccion'))


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
            tiempo.final = datetime.now().strftime("%Y %m %d %H %M %S")
            tiempo.save_to_db()
        else:
            tiempo = TiemposModel(user.id, prenda.orden_id, prenda.id, data['area_produccion'])
            tiempo.save_to_db()

    else:
        tiempo = TiemposModel(user.id, prenda.orden_id, prenda.id, data['area_produccion'])
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

    user = UserModel.find_by_usuario(usuario)

    if user:
        flash(f"El usuario {usuario} ya existe, por favor seleccione otro nombre de usuario", "error")
        return(redirect(url_for('configuracion')))

    else:
        user = UserModel(usuario, password, role)
        try:
            user.save_to_db()
            flash(f"Usuario {usuario} creado con éxito", "success")
            return(redirect(url_for('configuracion')))
        except:
            flash(f"Error al crear el usuario {usuario}, por favor intentelo nuevamente", "error")
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
            prenda.user_responsable = data["usuario"]
            prenda.save_to_db()
            return {"message":f"Se asigno exitosamente a {data['usuario']}"}
        
        else:
            return {"message":f"el usuario {data['usuario']} no existe"}
            
    else:
        return {"message":"Error al asignar usuario, por favor recargue la página e inténtelo nuevamente"}


@app.route('/verordenes')
def ver_ordenes():
    x = OrdenesModel.find()
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



if __name__ == "__main__":
    db.init_app(app)
    app.run(host="0.0.0.0", debug = True)