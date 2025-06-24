import React, { useState } from 'react';
import { Plus, Eye, Search, ShoppingCart, Calendar, DollarSign, User } from 'lucide-react';
import { UserRole } from '../App';

interface SalesProps {
  userRole: UserRole;
}

interface Sale {
  id: number;
  saleNumber: string;
  customerName: string;
  date: string;
  time: string;
  total: number;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia';
  status: 'completed' | 'pending' | 'cancelled';
  items: number;
}

const Sales: React.FC<SalesProps> = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewSale, setShowNewSale] = useState(false);

  // Sample data
  const [sales] = useState<Sale[]>([
    {
      id: 1,
      saleNumber: 'V000001',
      customerName: 'Ana García',
      date: '2024-01-15',
      time: '10:30',
      total: 125.50,
      paymentMethod: 'tarjeta',
      status: 'completed',
      items: 8
    },
    {
      id: 2,
      saleNumber: 'V000002',
      customerName: 'Carlos López',
      date: '2024-01-15',
      time: '10:25',
      total: 89.20,
      paymentMethod: 'efectivo',
      status: 'completed',
      items: 5
    },
    {
      id: 3,
      saleNumber: 'V000003',
      customerName: 'María Rodríguez',
      date: '2024-01-15',
      time: '10:20',
      total: 205.75,
      paymentMethod: 'transferencia',
      status: 'completed',
      items: 12
    },
    {
      id: 4,
      saleNumber: 'V000004',
      customerName: 'José Martínez',
      date: '2024-01-15',
      time: '10:15',
      total: 67.30,
      paymentMethod: 'efectivo',
      status: 'pending',
      items: 3
    }
  ]);

  const filteredSales = sales.filter(sale =>
    sale.saleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'efectivo':
        return '💵';
      case 'tarjeta':
        return '💳';
      case 'transferencia':
        return '🏦';
      default:
        return '💰';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Ventas</h1>
          <p className="text-gray-600 mt-1">Gestiona las transacciones del supermercado</p>
        </div>
        <button
          onClick={() => setShowNewSale(true)}
          className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Venta</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Ventas Hoy</p>
              <p className="text-2xl font-bold">$487.75</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Transacciones</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Promedio</p>
              <p className="text-2xl font-bold">$20.32</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Clientes</p>
              <p className="text-2xl font-bold">18</p>
            </div>
            <User className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar ventas por número o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venta
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha/Hora
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pago
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{sale.saleNumber}</div>
                      <div className="text-sm text-gray-500">{sale.items} artículos</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full p-2 text-white text-xs font-semibold mr-3">
                        {sale.customerName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{sale.customerName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{sale.date}</div>
                    <div className="text-gray-500">{sale.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${sale.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="flex items-center">
                      <span className="mr-2">{getPaymentMethodIcon(sale.paymentMethod)}</span>
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                      {sale.status === 'completed' ? 'Completada' : 
                       sale.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>Ver</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSales.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron ventas</h3>
          <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
        </div>
      )}
    </div>
  );
};

export default Sales;