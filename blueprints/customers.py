from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required
from models import Customer, db
from forms import CustomerForm, DeleteForm

customers_bp = Blueprint('customers', __name__)

@customers_bp.route('/')
@login_required
def index():
    page = request.args.get('page', 1, type=int)
    search = request.args.get('search', '')
    
    query = Customer.query.filter_by(is_active=True)
    
    if search:
        words = search.strip().split()
        for word in words:
            query = query.filter(
                (Customer.first_name.ilike(f"%{word}%")) |
                (Customer.last_name.ilike(f"%{word}%")) |
                (Customer.email.ilike(f"%{word}%")) |
                (Customer.phone.ilike(f"%{word}%"))
            )
    
    customers = query.order_by(Customer.first_name, Customer.last_name).paginate(
        page=page, per_page=20, error_out=False
    )
    
    delete_form = DeleteForm()
    return render_template('customers/index.html', customers=customers, search=search, delete_form=delete_form)

@customers_bp.route('/add', methods=['GET', 'POST'])
@login_required
def add():
    form = CustomerForm()
    if form.validate_on_submit():
        customer = Customer(
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            email=form.email.data,
            phone=form.phone.data,
            address=form.address.data,
            id_number=form.id_number.data,
            customer_type=form.customer_type.data,
            is_active=form.is_active.data
        )
        db.session.add(customer)
        db.session.commit()
        flash('Cliente agregado exitosamente', 'success')
        return redirect(url_for('customers.index'))
    
    return render_template('customers/form.html', form=form, title='Agregar Cliente')

@customers_bp.route('/<int:id>')
@login_required
def view(id):
    customer = Customer.query.get_or_404(id)
    return render_template('customers/view.html', customer=customer)

@customers_bp.route('/<int:id>/edit', methods=['GET', 'POST'])
@login_required
def edit(id):
    customer = Customer.query.get_or_404(id)
    form = CustomerForm(obj=customer)
    
    if form.validate_on_submit():
        form.populate_obj(customer)
        db.session.commit()
        flash('Cliente actualizado exitosamente', 'success')
        return redirect(url_for('customers.view', id=customer.id))
    
    return render_template('customers/form.html', form=form, customer=customer, title='Editar Cliente')

@customers_bp.route('/<int:id>/delete', methods=['POST'])
@login_required
def delete(id):
    customer = Customer.query.get_or_404(id)
    if customer.sales:
        flash('No se puede eliminar el cliente porque tiene ventas asociadas', 'error')
    else:
        customer.is_active = False
        db.session.commit()
        flash('Cliente eliminado exitosamente', 'success')
    return redirect(url_for('customers.index'))