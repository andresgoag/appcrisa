from datetime import datetime

from db import db



class TiemposModel(db.Model):

    __tablename__ = "tiempos"

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    orden_id = db.Column(db.Integer, db.ForeignKey('ordenes.id'))
    prenda_id = db.Column(db.Integer, db.ForeignKey('prendas.id'))
    inicio = db.Column(db.String(80))
    final = db.Column(db.String(80))
    area_produccion = db.Column(db.String(80))

    orden = db.relationship('OrdenesModel')
    prenda = db.relationship('PrendasModel')
    user = db.relationship('UserModel')

    def __init__(self, usuario_id, orden_id, prenda_id, area_produccion):
        self.usuario_id = usuario_id
        self.orden_id = orden_id
        self.prenda_id = prenda_id
        self.inicio = datetime.now().strftime("%Y %m %d %H %M %S")
        self.final = ""
        self.area_produccion = area_produccion

    def json(self):
        return {
            "usuario": self.usuario_id,
            "orden": self.orden_id,
            "prenda": self.prenda_id,
            "inicio": self.inicio,
            "final": self.final,
            "area_produccion": self.area_produccion
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_prendayusuario(cls, prenda_id, usuario_id):
        return cls.query.filter_by(prenda_id=prenda_id).filter_by(usuario_id=usuario_id).all()

    @classmethod
    def find_by_ordenyusuario(cls, orden_id, usuario_id):
        return cls.query.filter_by(orden_id=orden_id).filter_by(usuario_id=usuario_id).all()

    @classmethod
    def find(cls):
        return cls.query.all()
