'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Product, Sale, Expense } from '@/lib/types';

interface DashboardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNavigate: (page: any) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user, period]);

  const getDateFilter = () => {
    const now = new Date();
    if (period === 'today') {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    } else if (period === 'week') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d.toISOString();
    } else {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      return d.toISOString();
    }
  };

  const loadData = async () => {
    setLoading(true);
    const dateFilter = getDateFilter();

    const [prodRes, salesRes, expRes] = await Promise.all([
      supabase.from('products').select('*').eq('user_id', user!.id).eq('active', true),
      supabase.from('sales').select('*').eq('user_id', user!.id).gte('created_at', dateFilter).order('created_at', { ascending: false }),
      supabase.from('expenses').select('*').eq('user_id', user!.id).gte('created_at', dateFilter),
    ]);

    setProducts(prodRes.data || []);
    setSales(salesRes.data || []);
    setExpenses(expRes.data || []);
    setLoading(false);
  };

  const totalSales = sales.reduce((sum, s) => sum + Number(s.total), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const profit = totalSales - totalExpenses;
  const totalUnits = sales.reduce((sum, s) => {
    const items = Array.isArray(s.items) ? s.items : [];
    return sum + items.reduce((a: number, i: { quantity: number }) => a + i.quantity, 0);
  }, 0);
  const lowStockCount = products.filter(p => p.stock <= 2 && p.stock >= 0).length;
  const inventoryValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);

  // Top selling products
  const productSaleCount: Record<string, number> = {};
  sales.forEach(s => {
    const items = Array.isArray(s.items) ? s.items : [];
    items.forEach((i: { product_name: string; quantity: number }) => {
      productSaleCount[i.product_name] = (productSaleCount[i.product_name] || 0) + i.quantity;
    });
  });
  const topProducts = Object.entries(productSaleCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Resumen de tu negocio</p>
      </div>
      <div className="page-content">
        {/* Period tabs */}
        <div className="tabs" style={{ marginBottom: 20 }}>
          <button className={`tab ${period === 'today' ? 'active' : ''}`} onClick={() => setPeriod('today')}>Hoy</button>
          <button className={`tab ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>Semana</button>
          <button className={`tab ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>Mes</button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card" onClick={() => onNavigate('historial-ventas')} style={{ cursor: 'pointer' }}>
            <div className="stat-icon green">💰</div>
            <div className="stat-value">${totalSales.toLocaleString('es-MX', { minimumFractionDigits: 0 })}</div>
            <div className="stat-label">Ventas</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">💸</div>
            <div className="stat-value">${totalExpenses.toLocaleString('es-MX', { minimumFractionDigits: 0 })}</div>
            <div className="stat-label">Gastos</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">📈</div>
            <div className="stat-value" style={{ color: profit >= 0 ? '#43A047' : '#E53935' }}>
              ${profit.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
            </div>
            <div className="stat-label">Ganancia neta</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">📦</div>
            <div className="stat-value">{totalUnits}</div>
            <div className="stat-label">Unidades vendidas</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header"><h3>⚡ Acciones Rápidas</h3></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-primary btn-block" onClick={() => onNavigate('nueva-venta')}>
                💰 Registrar Venta
              </button>
              <button className="btn btn-accent btn-block" onClick={() => onNavigate('nuevo-pedido')}>
                🛒 Hacer Pedido
              </button>
              <button className="btn btn-outline btn-block" onClick={() => onNavigate('inventario')}>
                📦 Ver Inventario
              </button>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="card">
            <div className="card-header">
              <h3>⚠️ Stock Bajo</h3>
              <span className="badge badge-warning">{lowStockCount}</span>
            </div>
            <div className="card-body">
              {products.filter(p => p.stock <= 2).slice(0, 5).map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                  <span className={`badge ${p.stock === 0 ? 'badge-danger' : 'badge-warning'}`}>
                    {p.stock} uds
                  </span>
                </div>
              ))}
              {lowStockCount === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Sin alertas 🎉</p>}
            </div>
          </div>
        </div>

        {/* Top Products & Inventory Value */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div className="card">
            <div className="card-header"><h3>🏆 Más vendidos</h3></div>
            <div className="card-body">
              {topProducts.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Sin ventas en este periodo</p>}
              {topProducts.map(([name, qty], i) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: i === 0 ? 'var(--primary)' : 'var(--bg)', color: i === 0 ? 'white' : 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {i + 1}
                  </span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{name}</span>
                  <span className="badge badge-success">{qty} uds</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>💼 Valor del Inventario</h3></div>
            <div className="card-body" style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary-dark)' }}>
                ${inventoryValue.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 8 }}>
                {products.reduce((s, p) => s + p.stock, 0)} unidades en stock
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>
                {products.filter(p => p.active).length} productos activos
              </p>
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        {sales.length > 0 && (
          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-header">
              <h3>🕐 Últimas Ventas</h3>
              <button className="btn btn-sm btn-outline" onClick={() => onNavigate('historial-ventas')}>Ver todas</button>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Productos</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.slice(0, 5).map(s => (
                      <tr key={s.id}>
                        <td style={{ fontSize: 13 }}>{new Date(s.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                        <td style={{ fontSize: 13 }}>
                          {Array.isArray(s.items) ? s.items.map((i: { product_name: string; quantity: number }) => `${i.quantity}x ${i.product_name}`).join(', ') : ''}
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>${Number(s.total).toLocaleString('es-MX')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
