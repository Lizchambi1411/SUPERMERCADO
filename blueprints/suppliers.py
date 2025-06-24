from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required
from models import Supplier, db
from forms import SupplierForm
from decorators import admin_required

suppliers_bp = Blueprint('suppliers', __name__)

@suppliers_bp.route('/')
@login_required
@admin_required
def index():
    suppliers = Supplier.query.filter_by(is_active=True).order_by(Supplier.name).all()
    from forms import DeleteForm
    delete_form = DeleteForm()
    return render_template('suppliers/index.html', suppliers=suppliers, delete_form=delete_form)

@suppliers_bp.route('/add', methods=['GET', 'POST'])
@login_required
@admin_required
def add():
    form = SupplierForm()
    if form.validate_on_submit():
        supplier = Supplier(
            name=form.name.data,
            contact_person=form.contact_person.data,
            email=form.email.data,
            phone=form.phone.data,
            address=form.address.data,
            is_active=form.is_active.data
        )
        db.session.add(supplier)
        db.session.commit()
        flash('Proveedor agregado exitosamente', 'success')
        return redirect(url_for('suppliers.index'))
    
    return render_template('suppliers/form.html', form=form, title='Agregar Proveedor')

@suppliers_bp.route('/<int:id>')
@login_required
@admin_required
def view(id):
    supplier = Supplier.query.get_or_404(id)
    return render_template('suppliers/view.html', supplier=supplier)

@suppliers_bp.route('/<int:id>/edit', methods=['GET', 'POST'])
@login_required
@admin_required
def edit(id):
    supplier = Supplier.query.get_or_404(id)
    form = SupplierForm(obj=supplier)
    
    if form.validate_on_submit():
        form.populate_obj(supplier)
        db.session.commit()
        flash('Proveedor actualizado exitosamente', 'success')
        return redirect(url_for('suppliers.view', id=supplier.id))
    
    return render_template('suppliers/form.html', form=form, supplier=supplier, title='Editar Proveedor')

@suppliers_bp.route('/<int:id>/delete', methods=['POST'])
@login_required
@admin_required
def delete(id):
    supplier = Supplier.query.get_or_404(id)
    if supplier.products:
        flash('No se puede eliminar el proveedor porque tiene productos asociados', 'error')
    else:
        supplier.is_active = False
        db.session.commit()
        flash('Proveedor eliminado exitosamente', 'success')
    return redirect(url_for('suppliers.index'))