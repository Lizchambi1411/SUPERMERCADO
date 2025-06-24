import React from 'react';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { User } from '../App';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const stats = [
    {
      label: 'Ventas Hoy',
      value: '$15,280',
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Productos',
      value: '2,451',
      change: '+5%',
      trend: 'up',
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Clientes',
      value: '847',
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Pedidos',
      value: '156',
      change: '-2%',
      trend: 'down',
      icon: ShoppingCart,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentSales = [
    { id: 1, customer: 'Ana García', amount: '$125.50', time: '10:30 AM', status: 'completed' },
    { id: 2, customer: 'Carlos López', amount: '$89.20', time: '10:25 AM', status: 'completed' },
    { id: 3, customer: 'María Rodríguez', amount: '$205.75', time: '10:20 AM', status: 'completed' },
    { id: 4, customer: 'José Martínez', amount: '$67.30', time: '10:15 AM', status: 'pending' },
    { id: 5, customer: 'Laura Sánchez', amount: '$156.90', time: '10:10 AM', status: 'completed' }
  ];

  const lowStockProducts = [
    { id: 1, name: 'Leche Entera 1L', stock: 5, minStock: 20, category: 'Lácteos' },
    { id: 2, name: 'Pan Integral', stock: 8, minStock: 25, category: 'Panadería' },
    { id: 3, name: 'Arroz 1kg', stock: 12, minStock: 30, category: 'Granos' },
    { id: 4, name: 'Aceite Vegetal', stock: 3, minStock: 15, category: 'Aceites' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            ¡Bienvenido, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Aquí tienes un resumen de tu negocio hoy
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Fecha actual</p>
          <p className="text-lg font-semibold text-gray-800">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-semibold ml-1 ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} rounded-xl p-3 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
              Ventas Recientes
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Ver todas
            </button>
          </div>
          <div className="space-y-4">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2 text-white text-xs font-semibold">
                    {sale.customer.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{sale.customer}</p>
                    <p className="text-sm text-gray-500">{sale.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{sale.amount}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    sale.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sale.status === 'completed' ? 'Completado' : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Stock Bajo
            </h2>
            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div>
                  <p className="font-semibold text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-red-600">{product.stock}</span>
                    <span className="text-gray-400"> / {product.minStock}</span>
                  </p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(product.stock / product.minStock) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all duration-200 text-left">
            <Package className="w-6 h-6 mb-2" />
            <p className="font-semibold">Nueva Venta</p>
            <p className="text-sm opacity-80">Registrar nueva transacción</p>
          </button>
          <button className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all duration-200 text-left">
            <TrendingUp className="w-6 h-6 mb-2" />
            <p className="font-semibold">Agregar Producto</p>
            <p className="text-sm opacity-80">Añadir al inventario</p>
          </button>
          <button className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all duration-200 text-left">
            <BarChart3 className="w-6 h-6 mb-2" />
            <p className="font-semibold">Ver Reportes</p>
            <p className="text-sm opacity-80">Análisis detallado</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;