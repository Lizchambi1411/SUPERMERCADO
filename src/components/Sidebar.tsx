import React from 'react';
import {
  Home,
  Package,
  Tag,
  Truck,
  Users,
  ShoppingCart,
  BarChart3,
  FileText,
  UserPlus,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { User, UserRole } from '../App';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'from-blue-500 to-cyan-500', roles: ['admin', 'vendedor'] },
    { id: 'products', label: 'Productos', icon: Package, color: 'from-green-500 to-emerald-500', roles: ['admin', 'vendedor'] },
    { id: 'categories', label: 'Categorías', icon: Tag, color: 'from-purple-500 to-violet-500', roles: ['admin', 'vendedor'] },
    { id: 'suppliers', label: 'Proveedores', icon: Truck, color: 'from-orange-500 to-red-500', roles: ['admin'] },
    { id: 'customers', label: 'Clientes', icon: Users, color: 'from-pink-500 to-rose-500', roles: ['admin', 'vendedor'] },
    { id: 'sales', label: 'Ventas', icon: ShoppingCart, color: 'from-indigo-500 to-blue-500', roles: ['admin', 'vendedor'] },
    { id: 'inventory', label: 'Inventario', icon: BarChart3, color: 'from-teal-500 to-cyan-500', roles: ['admin'] },
    { id: 'reports', label: 'Reportes', icon: FileText, color: 'from-amber-500 to-orange-500', roles: ['admin'] },
    { id: 'users', label: 'Usuarios', icon: UserPlus, color: 'from-red-500 to-pink-500', roles: ['admin'] },
    { id: 'settings', label: 'Configuración', icon: Settings, color: 'from-gray-500 to-slate-500', roles: ['admin', 'vendedor'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="bg-white shadow-xl w-72 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">SuperMarket</h1>
            <p className="text-sm text-gray-500">Sistema de Gestión</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2 text-white font-semibold text-sm">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">
              {user.role === 'admin' ? '👑 Administrador' : '🛒 Vendedor'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-${item.color.split('-')[1]}-500/25`
                  : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className="font-medium flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 text-white" />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;