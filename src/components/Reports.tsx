import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Package, Users, ShoppingCart } from 'lucide-react';
import { UserRole } from '../App';

interface ReportsProps {
  userRole: UserRole;
}

const Reports: React.FC<ReportsProps> = ({ userRole }) => {
  const [dateRange, setDateRange] = useState('last30days');

  if (userRole !== 'admin') {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Acceso Restringido</h3>
        <p className="text-gray-500">Solo los administradores pueden ver los reportes</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reportes</h1>
          <p className="text-gray-600 mt-1">Análisis y estadísticas del negocio</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="today">Hoy</option>
            <option value="last7days">Últimos 7 días</option>
            <option value="last30days">Últimos 30 días</option>
            <option value="last3months">Últimos 3 meses</option>
          </select>
          <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Ventas Totales</p>
              <p className="text-2xl font-bold">$15,280</p>
              <p className="text-blue-200 text-sm">+12% vs período anterior</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Productos Vendidos</p>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-green-200 text-sm">+8% vs período anterior</p>
            </div>
            <Package className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Transacciones</p>
              <p className="text-2xl font-bold">156</p>
              <p className="text-purple-200 text-sm">+5% vs período anterior</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Clientes Únicos</p>
              <p className="text-2xl font-bold">89</p>
              <p className="text-orange-200 text-sm">+15% vs período anterior</p>
            </div>
            <Users className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Ventas por Día</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[420, 380, 520, 460, 680, 590, 720].map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg w-8 transition-all duration-500 hover:from-blue-600 hover:to-cyan-600"
                  style={{ height: `${(value / 720) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Productos Más Vendidos</h3>
            <Package className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            {[
              { name: 'Leche Entera 1L', sales: 89, revenue: 267 },
              { name: 'Pan Integral', sales: 76, revenue: 152 },
              { name: 'Arroz 1kg', sales: 65, revenue: 195 },
              { name: 'Aceite Vegetal', sales: 54, revenue: 324 },
              { name: 'Huevos Docena', sales: 48, revenue: 144 }
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} unidades</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">${product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Reportes Detallados</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Reporte de Ventas</h4>
            <p className="text-gray-600 text-sm mb-4">Análisis detallado de ventas por período, categoría y vendedor</p>
            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">Ver reporte →</button>
          </div>
          
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Reporte de Inventario</h4>
            <p className="text-gray-600 text-sm mb-4">Estado del stock, movimientos y productos con bajo inventario</p>
            <button className="text-green-600 hover:text-green-700 font-semibold text-sm">Ver reporte →</button>
          </div>
          
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Reporte de Clientes</h4>
            <p className="text-gray-600 text-sm mb-4">Análisis de comportamiento y preferencias de clientes</p>
            <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">Ver reporte →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;