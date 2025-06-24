from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required
from werkzeug.security import generate_password_hash
from models import User, db
from forms import UserForm
from decorators import admin_required

users_bp = Blueprint('users', __name__)

@users_bp.route('/')
@login_required
@admin_required
def index():
    search = request.args.get('search', '').strip()
    query = User.query.filter_by(is_active=True)
    if search:
        words = search.split()
        for word in words:
            query = query.filter(
                (User.first_name.ilike(f"%{word}%")) |
                (User.last_name.ilike(f"%{word}%"))
            )
    users = query.order_by(User.first_name, User.last_name).all()
    from forms import DeleteForm
    delete_form = DeleteForm()
    return render_template('users/index.html', users=users, delete_form=delete_form)

@users_bp.route('/add', methods=['GET', 'POST'])
@login_required
@admin_required
def add():
    form = UserForm()
    if form.validate_on_submit():
        user = User(
            username=form.username.data,
            email=form.email.data,
            password_hash=generate_password_hash(form.password.data),
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            role=form.role.data,
            is_active=form.is_active.data
        )
        db.session.add(user)
        db.session.commit()
        flash('Usuario agregado exitosamente', 'success')
        return redirect(url_for('users.index'))
    
    return render_template('users/form.html', form=form, title='Agregar Usuario')

@users_bp.route('/<int:id>/edit', methods=['GET', 'POST'])
@login_required
@admin_required
def edit(id):
    user = User.query.get_or_404(id)
    form = UserForm(obj=user)
    
    # No mostrar el campo de contraseña en edición
    del form.password
    del form.confirm_password
    
    if form.validate_on_submit():
        user.username = form.username.data
        user.email = form.email.data
        user.first_name = form.first_name.data
        user.last_name = form.last_name.data
        user.role = form.role.data
        user.is_active = form.is_active.data
        db.session.commit()
        flash('Usuario actualizado exitosamente', 'success')
        return redirect(url_for('users.index'))
    
    return render_template('users/form.html', form=form, user=user, title='Editar Usuario')

@users_bp.route('/<int:id>/delete', methods=['POST'])
@login_required
@admin_required
def delete(id):
    user = User.query.get_or_404(id)
    user.is_active = False
    db.session.commit()
    flash('Usuario desactivado exitosamente', 'success')
    return redirect(url_for('users.index'))