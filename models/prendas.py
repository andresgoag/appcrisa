from db import db
import ast

class PrendasModel(db.Model):

    __tablename__ = 'prendas'

    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(80))
    subtipo = db.Column(db.String(80))
    genero = db.Column(db.String(80))
    talla = db.Column(db.String(80))
    imagen = db.Column(db.String(500))
    precio = db.Column(db.String(80))
    cantidad = db.Column(db.String(80))
    especificacion = db.Column(db.String(300))
    caso_produccion = db.Column(db.String(80))
    estados_produccion = db.Column(db.String(400))
    area_responsable = db.Column(db.String(80))
    user_responsable = db.Column(db.String(80))
    empacado = db.Column(db.String(2))

    tiempos = db.relationship('TiemposModel', lazy='dynamic')

    orden_id = db.Column(db.Integer, db.ForeignKey('ordenes.id'))
    orden = db.relationship('OrdenesModel')
    

    def __init__(self, tipo, subtipo, genero, talla, imagen, precio, cantidad, especificacion, orden_id):
        self.tipo = tipo
        self.subtipo = subtipo
        self.genero = genero
        self.talla = talla
        self.imagen = imagen
        self.precio = precio
        self.cantidad = cantidad
        self.especificacion = especificacion
        self.orden_id = orden_id
        self.caso_produccion = ""
        self.estados_produccion = ""
        self.area_responsable = ""
        self.user_responsable = ""
        self.empacado = "no"

    def json(self):
        if self.estados_produccion == "":
            estados_produccion_dict = dict()
        else:
            estados_produccion_dict = ast.literal_eval(self.estados_produccion) 
        return {
            "id": self.id,
            "tipo":self.tipo, 
            "subtipo":self.subtipo, 
            "genero":self.genero, 
            "talla":self.talla, 
            "imagen":self.imagen, 
            "precio":self.precio, 
            "cantidad":self.cantidad, 
            "especificacion":self.especificacion,
            "orden_id":self.orden_id,
            "caso_produccion": self.caso_produccion,
            "estados_produccion": estados_produccion_dict,
            "area_responsable": self.area_responsable,
            "usuario_responsable": self.user_responsable,
            "empacado": self.empacado
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()
    