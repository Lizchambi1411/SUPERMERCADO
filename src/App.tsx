import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Categories from './components/Categories';
import Suppliers from './components/Suppliers';
import Customers from './components/Customers';
import Sales from './components/Sales';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import Users from './components/Users';
import Settings from './components/Settings';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import LandingPage from './components/LandingPage';

export type UserRole = 'admin' | 'vendedor';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  barcode: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minStock: number;
  maxStock: number;
  unit: string;
  categoryId: number;
  supplierId?: number;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
  isActive: boolean;
}

export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  productCount: number;
  isActive: boolean;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  customerType: 'individual' | 'empresa';
  totalPurchases: number;
  isActive: boolean;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'register' | 'dashboard'>('landing');

  // Global state for data management
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Leche Entera 1L',
      description: 'Leche entera pasteurizada de alta calidad',
      barcode: '7501234567890',
      costPrice: 2.50,
      sellingPrice: 3.00,
      stockQuantity: 45,
      minStock: 20,
      maxStock: 100,
      unit: 'unidad',
      categoryId: 1,
      supplierId: 1,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Pan Integral',
      description: 'Pan integral artesanal',
      barcode: '7501234567891',
      costPrice: 1.20,
      sellingPrice: 2.00,
      stockQuantity: 32,
      minStock: 25,
      maxStock: 80,
      unit: 'unidad',
      categoryId: 2,
      supplierId: 3,
      isActive: true,
      createdAt: '2024-01-15'
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Lácteos', description: 'Productos lácteos y derivados', productCount: 45, isActive: true },
    { id: 2, name: 'Panadería', description: 'Pan, bollería y productos de panadería', productCount: 32, isActive: true },
    { id: 3, name: 'Carnes', description: 'Carnes frescas y embutidos', productCount: 28, isActive: true },
    { id: 4, name: 'Verduras', description: 'Verduras y hortalizas frescas', productCount: 67, isActive: true }
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: 'Distribuidora Norte',
      contactPerson: 'Ana Martínez',
      email: 'ana@distrinorte.com',
      phone: '732-21458',
      address: 'Av. Industrial 123, Ciudad Norte',
      productCount: 45,
      isActive: true
    },
    {
      id: 2,
      name: 'Granos del Valle',
      contactPerson: 'Pedro Sánchez',
      email: 'pedro@granosvalle.com',
      phone: '658-01992',
      address: 'Calle Rural 456, Valle Verde',
      productCount: 32,
      isActive: true
    }
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      firstName: 'Alex',
      lastName: 'Cori',
      email: 'cori@email.com',
      phone: '732-41490',
      address: 'Av. florida',
      customerType: 'individual',
      totalPurchases: 1250.50,
      isActive: true
    },
    {
      id: 2,
      firstName: 'Lizett',
      lastName: 'Chambi',
      email: 'liz@email.com',
      phone: '748-48627',
      address: 'Av. Americas',
      customerType: 'individual',
      totalPurchases: 890.25,
      isActive: true
    }
  ]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
    setActiveMenu('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
    setActiveMenu('dashboard');
  };

  const handleRegisterSuccess = () => {
    setCurrentPage('login');
  };

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  const navigateToRegister = () => {
    setCurrentPage('register');
  };

  const navigateToLanding = () => {
    setCurrentPage('landing');
  };

  // CRUD Functions
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.max(...products.map(p => p.id)) + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, isActive: false } : p));
  };

  const addCategory = (category: Omit<Category, 'id' | 'productCount'>) => {
    const newCategory: Category = {
      ...category,
      id: Math.max(...categories.map(c => c.id)) + 1,
      productCount: 0
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: number, updatedCategory: Partial<Category>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...updatedCategory } : c));
  };

  const deleteCategory = (id: number) => {
    setCategories(categories.map(c => c.id === id ? { ...c, isActive: false } : c));
  };

  const addSupplier = (supplier: Omit<Supplier, 'id' | 'productCount'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Math.max(...suppliers.map(s => s.id)) + 1,
      productCount: 0
    };
    setSuppliers([...suppliers, newSupplier]);
  };

  const updateSupplier = (id: number, updatedSupplier: Partial<Supplier>) => {
    setSuppliers(suppliers.map(s => s.id === id ? { ...s, ...updatedSupplier } : s));
  };

  const deleteSupplier = (id: number) => {
    setSuppliers(suppliers.map(s => s.id === id ? { ...s, isActive: false } : s));
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'totalPurchases'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Math.max(...customers.map(c => c.id)) + 1,
      totalPurchases: 0
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (id: number, updatedCustomer: Partial<Customer>) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, ...updatedCustomer } : c));
  };

  const deleteCustomer = (id: number) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, isActive: false } : c));
  };

  // Landing Page
  if (currentPage === 'landing') {
    return (
      <LandingPage 
        onLogin={navigateToLogin}
        onRegister={navigateToRegister}
      />
    );
  }

  // Login Page
  if (currentPage === 'login') {
    return (
      <LoginForm 
        onLogin={handleLogin}
        onBackToHome={navigateToLanding}
        onGoToRegister={navigateToRegister}
      />
    );
  }

  // Register Page
  if (currentPage === 'register') {
    return (
      <RegisterForm 
        onRegisterSuccess={handleRegisterSuccess}
        onBackToHome={navigateToLanding}
        onGoToLogin={navigateToLogin}
      />
    );
  }

  // Dashboard (authenticated area)
  if (!currentUser) {
    return (
      <LandingPage 
        onLogin={navigateToLogin}
        onRegister={navigateToRegister}
      />
    );
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard user={currentUser} />;
      case 'products':
        return (
          <Products 
            userRole={currentUser.role}
            products={products}
            categories={categories}
            suppliers={suppliers}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
          />
        );
      case 'categories':
        return (
          <Categories 
            userRole={currentUser.role}
            categories={categories}
            onAdd={addCategory}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
          />
        );
      case 'suppliers':
        return (
          <Suppliers 
            userRole={currentUser.role}
            suppliers={suppliers}
            onAdd={addSupplier}
            onUpdate={updateSupplier}
            onDelete={deleteSupplier}
          />
        );
      case 'customers':
        return (
          <Customers 
            userRole={currentUser.role}
            customers={customers}
            onAdd={addCustomer}
            onUpdate={updateCustomer}
            onDelete={deleteCustomer}
          />
        );
      case 'sales':
        return <Sales userRole={currentUser.role} products={products} customers={customers} />;
      case 'inventory':
        return <Inventory userRole={currentUser.role} products={products} onUpdate={updateProduct} />;
      case 'reports':
        return <Reports userRole={currentUser.role} />;
      case 'users':
        return currentUser.role === 'admin' ? <Users /> : <Dashboard user={currentUser} />;
      case 'settings':
        return <Settings userRole={currentUser.role} />;
      default:
        return <Dashboard user={currentUser} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        user={currentUser}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;