from db import db

class ConfigPrendasModel(db.Model):

    __tablename__ = "config_prendas"

    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String(100))

    subtipos = db.relationship('ConfigSubtipoPrendasModel', lazy='dynamic')


    def __init__(self, item):
        self.item = item

    def json(self):
        return {
            "item": self.item,
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def find_one(cls, item):
        return cls.query.filter_by(item=item).first()

    @classmethod
    def find(cls):
        return cls.query.all()

class ConfigSubtipoPrendasModel(db.Model):

    __tablename__ = "config_subtipo_prendas"

    id = db.Column(db.Integer, primary_key=True)
    prenda_id = db.Column(db.Integer, db.ForeignKey('config_prendas.id'))
    item = db.Column(db.String(100))


    def __init__(self, item, prenda_id):
        self.item = item
        self.prenda_id = prenda_id

    def json(self):
        return {
            "item": self.item,
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def find_one(cls, item):
        return cls.query.filter_by(item=item).first()

    @classmethod
    def find_by_prenda(cls, prenda_id):
        return cls.query.filter_by(prenda_id=prenda_id).all()

    @classmethod
    def find(cls):
        return cls.query.all()

class ConfigAreasModel(db.Model):

    __tablename__ = "config_areas"

    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String(100))


    def __init__(self, item):
        self.item = item

    def json(self):
        return {
            "item": self.item,
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def find_one(cls, item):
        return cls.query.filter_by(item=item).first()

    @classmethod
    def find(cls):
        return cls.query.all()

class ConfigCategoriaEnvioModel(db.Model):

    __tablename__ = "config_categoria_envio"

    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String(100))


    def __init__(self, item):
        self.item = item

    def json(self):
        return {
            "item": self.item,
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def find_one(cls, item):
        return cls.query.filter_by(item=item).first()

    @classmethod
    def find(cls):
        return cls.query.all()

class ConfigEmpresaEnvioModel(db.Model):

    __tablename__ = "config_empresa_envio"

    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String(100))


    def __init__(self, item):
        self.item = item

    def json(self):
        return {
            "item": self.item,
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def find_one(cls, item):
        return cls.query.filter_by(item=item).first()

    @classmethod
    def find(cls):
        return cls.query.all()

class ConfigOpcionesEnvioModel(db.Model):

    __tablename__ = "config_opciones_envio"

    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String(100))


    def __init__(self, item):
        self.item = item

    def json(self):
        return {
            "item": self.item,
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def find_one(cls, item):
        return cls.query.filter_by(item=item).first()

    @classmethod
    def find(cls):
        return cls.query.all()

class ConfigMediosCompraModel(db.Model):

    __tablename__ = "config_medios_compra"

    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String(100))


    def __init__(self, item):
        self.item = item

    def json(self):
        return {
            "item": self.item,
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def find_one(cls, item):
        return cls.query.filter_by(item=item).first()

    @classmethod
    def find(cls):
        return cls.query.all()

class ConfigMarcasModel(db.Model):

    __tablename__ = "config_marcas"

    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String(100))


    def __init__(self, item):
        self.item = item

    def json(self):
        return {
            "item": self.item,
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def find_one(cls, item):
        return cls.query.filter_by(item=item).first()

    @classmethod
    def find(cls):
        return cls.query.all()

class ConfigEstadosOrdenModel(db.Model):

    __tablename__ = "config_estados_orden"

    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String(100))


    def __init__(self, item):
        self.item = item

    def json(self):
        return {
            "item": self.item,
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def find_one(cls, item):
        return cls.query.filter_by(item=item).first()

    @classmethod
    def find(cls):
        return cls.query.all()

class ConfigMediosPagoModel(db.Model):

    __tablename__ = "config_medios_pago"

    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String(100))


    def __init__(self, item):
        self.item = item

    def json(self):
        return {
            "item": self.item,
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def find_one(cls, item):
        return cls.query.filter_by(item=item).first()

    @classmethod
    def find(cls):
        return cls.query.all()

class ConfigTallasModel(db.Model):

    __tablename__ = "config_tallas"

    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String(100))


    def __init__(self, item):
        self.item = item

    def json(self):
        return {
            "item": self.item,
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def find_one(cls, item):
        return cls.query.filter_by(item=item).first()

    @classmethod
    def find(cls):
        return cls.query.all()
