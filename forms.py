from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, DecimalField, IntegerField, SelectField, BooleanField, PasswordField, DateField
from wtforms.validators import DataRequired, Email, Length, NumberRange, Optional, EqualTo, ValidationError
from wtforms_sqlalchemy.fields import QuerySelectField
from models import Category, Supplier, Customer, User, Product

# Formularios de autenticación
class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()],
                       render_kw={"placeholder": "usuario@supermercado.com"})
    password = PasswordField('Contraseña', validators=[DataRequired()],
                            render_kw={"placeholder": "••••••••"})

class RegisterForm(FlaskForm):
    first_name = StringField('Nombre', validators=[DataRequired(), Length(min=2, max=50)],
                            render_kw={"placeholder": "Tu nombre"})
    last_name = StringField('Apellido', validators=[DataRequired(), Length(min=2, max=50)],
                           render_kw={"placeholder": "Tu apellido"})
    username = StringField('Nombre de Usuario', validators=[DataRequired(), Length(min=3, max=80)],
                          render_kw={"placeholder": "nombre_usuario"})
    email = StringField('Email', validators=[DataRequired(), Email()],
                       render_kw={"placeholder": "tu@email.com"})
    role = SelectField('Rol', choices=[('vendedor', 'Vendedor'), ('admin', 'Administrador')], 
                      validators=[DataRequired()], default='vendedor')
    password = PasswordField('Contraseña', validators=[DataRequired(), Length(min=6)],
                            render_kw={"placeholder": "Mínimo 6 caracteres"})
    confirm_password = PasswordField('Confirmar Contraseña', 
                                   validators=[DataRequired(), EqualTo('password', message='Las contraseñas deben coincidir')],
                                   render_kw={"placeholder": "Confirma tu contraseña"})
    
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('Este nombre de usuario ya está en uso.')
    
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('Este email ya está registrado.')

class UserForm(FlaskForm):
    username = StringField('Nombre de Usuario', validators=[DataRequired(), Length(min=3, max=80)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    first_name = StringField('Nombre', validators=[DataRequired(), Length(max=50)])
    last_name = StringField('Apellido', validators=[DataRequired(), Length(max=50)])
    role = SelectField('Rol', choices=[('admin', 'Administrador'), ('vendedor', 'Vendedor')], validators=[DataRequired()])
    password = PasswordField('Contraseña', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirmar Contraseña', 
                                   validators=[DataRequired(), EqualTo('password')])
    is_active = BooleanField('Activo')

# Formularios de productos
class ProductForm(FlaskForm):
    name = StringField('Nombre del Producto', validators=[DataRequired(), Length(max=200)])
    description = TextAreaField('Descripción')
    barcode = StringField('Código de Barras', validators=[Optional(), Length(max=50)])
    cost_price = DecimalField('Precio de Costo', validators=[DataRequired(), NumberRange(min=0)], places=2)
    selling_price = DecimalField('Precio de Venta', validators=[DataRequired(), NumberRange(min=0)], places=2)
    stock_quantity = IntegerField('Cantidad en Stock', validators=[DataRequired(), NumberRange(min=0)])
    min_stock = IntegerField('Stock Mínimo', validators=[DataRequired(), NumberRange(min=0)])
    max_stock = IntegerField('Stock Máximo', validators=[Optional(), NumberRange(min=0)])
    unit = SelectField('Unidad', choices=[
        ('unidad', 'Unidad'),
        ('kg', 'Kilogramo'),
        ('litro', 'Litro'),
        ('metro', 'Metro'),
        ('caja', 'Caja'),
        ('paquete', 'Paquete')
    ], validators=[DataRequired()])
    category_id = QuerySelectField(
        'Categoría', 
        query_factory=lambda: Category.query.filter_by(is_active=True).all(),
        get_label='name',
        validators=[DataRequired()]
    )
    supplier_id = QuerySelectField(
        'Proveedor', 
        query_factory=lambda: Supplier.query.filter_by(is_active=True).all(),
        get_label='name',
        validators=[Optional()],
        allow_blank=True,
        blank_text='Seleccionar proveedor...'
    )
    is_active = BooleanField('Activo', default=True)

# Formularios de categorías
class CategoryForm(FlaskForm):
    name = StringField('Nombre de la Categoría', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Descripción')
    is_active = BooleanField('Activa', default=True)

# Formularios de proveedores
class SupplierForm(FlaskForm):
    name = StringField('Nombre del Proveedor', validators=[DataRequired(), Length(max=150)])
    contact_person = StringField('Persona de Contacto', validators=[Optional(), Length(max=100)])
    email = StringField('Email', validators=[Optional(), Email()])
    phone = StringField('Teléfono', validators=[Optional(), Length(max=20)])
    address = TextAreaField('Dirección')
    is_active = BooleanField('Activo', default=True)

# Formularios de clientes
class CustomerForm(FlaskForm):
    first_name = StringField('Nombre', validators=[DataRequired(), Length(max=50)])
    last_name = StringField('Apellido', validators=[DataRequired(), Length(max=50)])
    email = StringField('Email', validators=[Optional(), Email()])
    phone = StringField('Teléfono', validators=[Optional(), Length(max=20)])
    address = TextAreaField('Dirección')
    id_number = StringField('Número de Identificación', validators=[Optional(), Length(max=20)])
    customer_type = SelectField('Tipo de Cliente', choices=[
        ('individual', 'Individual'),
        ('empresa', 'Empresa')
    ], validators=[DataRequired()])
    is_active = BooleanField('Activo', default=True)

# Formularios de ventas
class SaleForm(FlaskForm):
    customer_id = QuerySelectField(
        'Cliente', 
        query_factory=lambda: Customer.query.filter_by(is_active=True).all(),
        get_label='full_name',
        validators=[Optional()],
        allow_blank=True,
        blank_text='Cliente general...'
    )
    payment_method = SelectField('Método de Pago', choices=[
        ('efectivo', 'Efectivo'),
        ('tarjeta', 'Tarjeta'),
        ('transferencia', 'Transferencia')
    ], validators=[DataRequired()])
    discount_amount = DecimalField('Descuento', validators=[Optional(), NumberRange(min=0)], places=2, default=0)
    notes = TextAreaField('Notas')

# Formulario simple para eliminar (con CSRF)
class DeleteForm(FlaskForm):
    pass

# Formularios de movimientos de inventario
class InventoryMovementForm(FlaskForm):
    product_id = QuerySelectField(
        'Producto', 
        query_factory=lambda: Product.query.filter_by(is_active=True).all(),
        get_label='name',
        validators=[DataRequired()]
    )
    movement_type = SelectField('Tipo de Movimiento', choices=[
        ('entrada', 'Entrada'),
        ('salida', 'Salida'),
        ('ajuste', 'Ajuste')
    ], validators=[DataRequired()])
    quantity = IntegerField('Cantidad', validators=[DataRequired()])
    reason = StringField('Motivo', validators=[DataRequired(), Length(max=100)])
    notes = TextAreaField('Notas')