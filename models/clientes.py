from db import db

class ClientesModel(db.Model):

    __tablename__ = 'clientes'

    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(80))
    nombre = db.Column(db.String(80))
    correo = db.Column(db.String(80))
    tipodoc = db.Column(db.String(20))
    cedula = db.Column(db.String(80))
    telefono = db.Column(db.String(80))
    direccion = db.Column(db.String(100))
    barrio = db.Column(db.String(80))
    ciudad = db.Column(db.String(80))
    departamento = db.Column(db.String(80))
    pais = db.Column(db.String(80))
    codigo_postal = db.Column(db.String(80))

    ordenes = db.relationship('OrdenesModel', lazy='dynamic')

    def __init__(self, tipo, nombre, correo, tipodoc, cedula, telefono, direccion, barrio, ciudad, departamento, pais, codigo_postal):
        self.tipo = tipo
        self.nombre = nombre
        self.correo = correo
        self.tipodoc = tipodoc
        self.cedula = cedula
        self.telefono = telefono
        self.direccion = direccion
        self.barrio = barrio
        self.ciudad = ciudad
        self.departamento = departamento
        self.pais = pais
        self.codigo_postal = codigo_postal

    def json(self):
        return {
            "id": self.id,
            "tipo":self.tipo, 
            "nombre":self.nombre,
            "correo": self.correo,
            "tipodoc":self.tipodoc, 
            "cedula":self.cedula, 
            "telefono":self.telefono, 
            "direccion":self.direccion,
            "barrio":self.barrio,
            "ciudad":self.ciudad, 
            "departamento":self.departamento,
            "pais":self.pais,
            "codigo_postal":self.codigo_postal
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_cedula(cls, cedula):
        return cls.query.filter_by(cedula=cedula).first()
        


    