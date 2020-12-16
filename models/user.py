from db import db

class UserModel(db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(100))
    password = db.Column(db.String(100))
    role = db.Column(db.String(100))

    tiempos = db.relationship('TiemposModel', lazy='dynamic')

    def __init__(self, usuario, password, role):
        self.usuario = usuario
        self.password = password
        self.role = role

    def json():
        return {
            "usuario": self.usuario,
            "role": self.role
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_usuario(cls, usuario):
        return cls.query.filter_by(usuario=usuario).first()
