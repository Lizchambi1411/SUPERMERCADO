import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Palette, Save } from 'lucide-react';
import { UserRole } from '../App';

interface SettingsProps {
  userRole: UserRole;
}

const Settings: React.FC<SettingsProps> = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User, roles: ['admin', 'vendedor'] },
    { id: 'notifications', label: 'Notificaciones', icon: Bell, roles: ['admin', 'vendedor'] },
    { id: 'security', label: 'Seguridad', icon: Shield, roles: ['admin', 'vendedor'] },
    { id: 'system', label: 'Sistema', icon: Database, roles: ['admin'] },
    { id: 'appearance', label: 'Apariencia', icon: Palette, roles: ['admin', 'vendedor'] },
  ];

  const filteredTabs = tabs.filter(tab => tab.roles.includes(userRole));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>
        <p className="text-gray-600 mt-1">Personaliza tu experiencia en el sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <nav className="space-y-2">
              {filteredTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 text-left ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Información del Perfil</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      defaultValue="María"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      defaultValue="González"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="admin@supermercado.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 234 567 8900"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2">
                  <Save className="w-5 h-5" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Notificaciones</h2>
                <div className="space-y-4">
                  {[
                    { id: 'stock', label: 'Alertas de stock bajo', description: 'Recibir notificaciones cuando el stock esté bajo' },
                    { id: 'sales', label: 'Resumen de ventas', description: 'Recibir resumen diario de ventas' },
                    { id: 'system', label: 'Actualizaciones del sistema', description: 'Notificaciones sobre actualizaciones y mantenimiento' },
                    { id: 'reports', label: 'Reportes automáticos', description: 'Recibir reportes semanales por email' }
                  ].map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-800">{notification.label}</h3>
                        <p className="text-sm text-gray-600">{notification.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Seguridad</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Cambiar Contraseña</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contraseña Actual
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmar Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-200">
                    Actualizar Contraseña
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'system' && userRole === 'admin' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Configuración del Sistema</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-2">Base de Datos</h3>
                    <p className="text-sm text-gray-600 mb-4">Gestionar respaldos y mantenimiento</p>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                      Crear Respaldo
                    </button>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-2">Logs del Sistema</h3>
                    <p className="text-sm text-gray-600 mb-4">Ver registros de actividad</p>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                      Ver Logs
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Apariencia</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-4">Tema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['Claro', 'Oscuro', 'Automático'].map((theme) => (
                        <div key={theme} className="p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                          <div className="text-center">
                            <div className={`w-16 h-16 mx-auto mb-2 rounded-lg ${
                              theme === 'Claro' ? 'bg-white border-2 border-gray-300' :
                              theme === 'Oscuro' ? 'bg-gray-800' : 'bg-gradient-to-br from-white to-gray-800'
                            }`}></div>
                            <p className="font-medium text-gray-800">{theme}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;