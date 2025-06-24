from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required
from models import Category, db
from forms import CategoryForm, DeleteForm
from decorators import admin_required

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('/')
@login_required
def index():
    search = request.args.get('search', '').strip()
    query = Category.query.filter_by(is_active=True)
    if search:
        query = query.filter(Category.name.ilike(f"%{search}%"))
    categories = query.order_by(Category.name).all()
    delete_form = DeleteForm()
    return render_template('categories/index.html', categories=categories, delete_form=delete_form)

@categories_bp.route('/add', methods=['GET', 'POST'])
@login_required
@admin_required
def add():
    form = CategoryForm()
    if form.validate_on_submit():
        category = Category(
            name=form.name.data,
            description=form.description.data,
            is_active=form.is_active.data
        )
        db.session.add(category)
        db.session.commit()
        flash('Categoría agregada exitosamente', 'success')
        return redirect(url_for('categories.index'))
    
    return render_template('categories/form.html', form=form, title='Agregar Categoría')

@categories_bp.route('/<int:id>/edit', methods=['GET', 'POST'])
@login_required
@admin_required
def edit(id):
    category = Category.query.get_or_404(id)
    form = CategoryForm(obj=category)
    
    if form.validate_on_submit():
        form.populate_obj(category)
        db.session.commit()
        flash('Categoría actualizada exitosamente', 'success')
        return redirect(url_for('categories.index'))
    
    return render_template('categories/form.html', form=form, category=category, title='Editar Categoría')

@categories_bp.route('/<int:id>/delete', methods=['POST'])
@login_required
@admin_required
def delete(id):
    category = Category.query.get_or_404(id)
    if category.products:
        flash('No se puede eliminar la categoría porque tiene productos asociados', 'error')
    else:
        category.is_active = False
        db.session.commit()
        flash('Categoría eliminada exitosamente', 'success')
    return redirect(url_for('categories.index'))