from db import db
from datetime import datetime

class OrdenesModel(db.Model):

    __tablename__ = 'ordenes'

    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(80))
    numero_orden = db.Column(db.String(80))
    prioridad = db.Column(db.String(5))
    estado_orden = db.Column(db.String(80))
    incluir_envio = db.Column(db.String(80))
    opcion_envio = db.Column(db.String(80))
    empresa_envio = db.Column(db.String(80))
    precio_envio = db.Column(db.String(80))
    guia_envio = db.Column(db.String(80))
    abono = db.Column(db.String(80))
    precio_total = db.Column(db.String(80))
    marca = db.Column(db.String(80))
    medio_compra = db.Column(db.String(80))
    forma_pago = db.Column(db.String(80))
    pagado = db.Column(db.String(80))
    comentarios = db.Column(db.String(300))
    fecha = db.Column(db.String(80))
    tiempo_estimado = db.Column(db.String(8))

    prendas = db.relationship('PrendasModel', lazy='dynamic')
    tiempos = db.relationship('TiemposModel', lazy='dynamic')


    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'))
    cliente = db.relationship('ClientesModel')

    def __init__(self, user, numero_orden, prioridad, estado_orden, incluir_envio, opcion_envio, empresa_envio, precio_envio, guia_envio, abono, precio_total, marca, medio_compra, forma_pago, pagado, comentarios, cliente_id, tiempo_estimado):
        self.user = user
        self.numero_orden = numero_orden
        self.prioridad = prioridad
        self.estado_orden = estado_orden
        self.incluir_envio = incluir_envio
        self.opcion_envio = opcion_envio
        self.empresa_envio = empresa_envio
        self.precio_envio = precio_envio
        self.guia_envio = guia_envio
        self.abono = abono
        self.precio_total = precio_total
        self.marca = marca
        self.medio_compra = medio_compra
        self.forma_pago = forma_pago
        self.pagado = pagado
        self.comentarios = comentarios
        self.cliente_id = cliente_id
        self.tiempo_estimado = tiempo_estimado
        self.fecha = datetime.now().strftime("%Y-%m-%d")


    def json(self):

        lista_prendas = list()
        
        for i in self.prendas:
            lista_prendas.append(i.json())

        return {
            "id": self.id,
            "usuario_responsable": self.user,
            "numero_orden": self.numero_orden,
            "prioritaria":self.prioridad,
            "estado_orden":self.estado_orden,
            "incluir_envio": self.incluir_envio,
            "opcion_envio": self.opcion_envio,
            "empresa_envio": self.empresa_envio,
            "precio_envio": self.precio_envio,
            "guia_envio": self.guia_envio,
            "abono": self.abono,
            "precio_total": self.precio_total,
            "marca": self.marca,
            "medio_compra": self.medio_compra,
            "forma_pago": self.forma_pago,
            "pagado": self.pagado,
            "comentarios": self.comentarios,
            "prendas": lista_prendas,
            "cliente": self.cliente.json(),
            "fecha": self.fecha,
            "tiempo_estimado": self.tiempo_estimado
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_orden(cls, numero_orden):
        return cls.query.filter_by(numero_orden=numero_orden).first()

    @classmethod
    def find(cls):
        return cls.query.all()
        