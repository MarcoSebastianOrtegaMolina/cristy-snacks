'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Dashboard from './modules/Dashboard';
import Productos from './modules/Productos';
import Inventario from './modules/Inventario';
import NuevaVenta from './modules/NuevaVenta';
import HistorialVentas from './modules/HistorialVentas';
import NuevoPedido from './modules/NuevoPedido';
import Gastos from './modules/Gastos';
import Configuracion from './modules/Configuracion';

type Page = 'dashboard' | 'productos' | 'inventario' | 'nueva-venta' | 'historial-ventas' | 'nuevo-pedido' | 'gastos' | 'configuracion';

const NAV_ITEMS: { page: Page; icon: string; label: string; section?: string }[] = [
  { page: 'dashboard', icon: '📊', label: 'Dashboard', section: 'PRINCIPAL' },
  { page: 'productos', icon: '🥜', label: 'Productos' },
  { page: 'inventario', icon: '📦', label: 'Inventario' },
  { page: 'nueva-venta', icon: '💰', label: 'Nueva Venta', section: 'VENTAS' },
  { page: 'historial-ventas', icon: '📋', label: 'Historial' },
  { page: 'nuevo-pedido', icon: '🛒', label: 'Hacer Pedido', section: 'PEDIDOS' },
  { page: 'gastos', icon: '💸', label: 'Gastos', section: 'FINANZAS' },
  { page: 'configuracion', icon: '⚙️', label: 'Configuración', section: 'SISTEMA' },
];

export default function AppShell() {
  const { user, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'productos': return <Productos />;
      case 'inventario': return <Inventario />;
      case 'nueva-venta': return <NuevaVenta onComplete={() => setCurrentPage('historial-ventas')} />;
      case 'historial-ventas': return <HistorialVentas />;
      case 'nuevo-pedido': return <NuevoPedido />;
      case 'gastos': return <Gastos />;
      case 'configuracion': return <Configuracion />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar overlay for mobile */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src="/logo.png" alt="Logo" className="sidebar-logo" />
          <div className="sidebar-brand">
            Cristy Snack&apos;s
            <small>Semillas y Frutos Secos</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <div key={item.page}>
              {item.section && <div className="nav-section-label">{item.section}</div>}
              <button
                className={`nav-link ${currentPage === item.page ? 'active' : ''}`}
                onClick={() => { setCurrentPage(item.page); setSidebarOpen(false); }}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={signOut}>
            <div className="user-avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.email?.split('@')[0]}</div>
              <div className="user-email">Cerrar sesión →</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
