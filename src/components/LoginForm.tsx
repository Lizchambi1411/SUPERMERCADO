import React, { useState } from 'react';
import { ShoppingCart, User, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { User as UserType } from '../App';

interface LoginFormProps {
  onLogin: (user: UserType) => void;
  onBackToHome: () => void;
  onGoToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onBackToHome, onGoToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Usuarios de prueba
  const testUsers = [
    { id: 1, name: 'María González', email: 'admin@supermercado.com', role: 'admin' as const, password: 'admin123' },
    { id: 2, name: 'Carlos Rodríguez', email: 'vendedor@supermercado.com', role: 'vendedor' as const, password: 'vendedor123' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular autenticación
    setTimeout(() => {
      const user = testUsers.find(u => u.email === email && u.password === password);
      if (user) {
        onLogin({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        });
      } else {
        setError('Email o contraseña incorrectos');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleTestLogin = (role: 'admin' | 'vendedor') => {
    const user = testUsers.find(u => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SuperMarket Pro
          </h1>
          <p className="text-gray-600 mt-2">Iniciar Sesión</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="usuario@supermercado.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-4">Cuentas de prueba:</p>
          <div className="space-y-2">
            <button
              onClick={() => handleTestLogin('admin')}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2 rounded-lg text-sm hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
            >
              👤 Administrador (admin@supermercado.com)
            </button>
            <button
              onClick={() => handleTestLogin('vendedor')}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white py-2 rounded-lg text-sm hover:from-orange-600 hover:to-yellow-700 transition-all duration-200"
            >
              🛒 Vendedor (vendedor@supermercado.com)
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">
            ¿No tienes una cuenta?{' '}
            <button
              onClick={onGoToRegister}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Registrarse
            </button>
          </p>
          
          <button
            onClick={onBackToHome}
            className="flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;