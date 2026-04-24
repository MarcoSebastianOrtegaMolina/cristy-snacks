'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Sale } from '@/lib/types';

export default function HistorialVentas() {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadSales(); }, [user, period]);

  const loadSales = async () => {
    setLoading(true);
    let query = supabase.from('sales').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });

    if (period !== 'all') {
      const now = new Date();
      let from: Date;
      if (period === 'today') from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      else if (period === 'week') { from = new Date(now); from.setDate(from.getDate() - 7); }
      else { from = new Date(now); from.setDate(from.getDate() - 30); }
      query = query.gte('created_at', from.toISOString());
    }

    const { data } = await query;
    setSales(data || []);
    setLoading(false);
  };

  const totalSales = sales.reduce((s, sale) => s + Number(sale.total), 0);
  const totalCost = sales.reduce((s, sale) => {
    const items = Array.isArray(sale.items) ? sale.items : [];
    return s + items.reduce((a: number, i: { unit_cost: number; quantity: number }) => a + (i.unit_cost * i.quantity), 0);
  }, 0);
  const totalProfit = totalSales - totalCost;

  const deleteSale = async (sale: Sale) => {
    if (!confirm('¿Eliminar esta venta? (No se restaurará el stock)')) return;
    await supabase.from('sales').delete().eq('id', sale.id);
    loadSales();
  };

  return (
    <>
      <div className="page-header">
        <h1>📋 Historial de Ventas</h1>
        <p>{sales.length} ventas registradas</p>
      </div>
      <div className="page-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon green">💰</div>
            <div className="stat-value">${totalSales.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</div>
            <div className="stat-label">Total vendido</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">📊</div>
            <div className="stat-value">${totalCost.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</div>
            <div className="stat-label">Costo de lo vendido</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">📈</div>
            <div className="stat-value" style={{ color: totalProfit >= 0 ? '#43A047' : '#E53935' }}>
              ${totalProfit.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </div>
            <div className="stat-label">Ganancia bruta</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">🧾</div>
            <div className="stat-value">{sales.length}</div>
            <div className="stat-label">Ventas</div>
          </div>
        </div>

        <div className="tabs">
          <button className={`tab ${period === 'today' ? 'active' : ''}`} onClick={() => setPeriod('today')}>Hoy</button>
          <button className={`tab ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>Semana</button>
          <button className={`tab ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>Mes</button>
          <button className={`tab ${period === 'all' ? 'active' : ''}`} onClick={() => setPeriod('all')}>Todo</button>
        </div>

        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            {sales.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>Sin ventas</h3>
                <p>No hay ventas registradas en este periodo</p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Productos</th>
                      <th>Total</th>
                      <th>Ganancia</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map(sale => {
                      const items = Array.isArray(sale.items) ? sale.items : [];
                      const saleCost = items.reduce((a: number, i: { unit_cost: number; quantity: number }) => a + (i.unit_cost * i.quantity), 0);
                      const saleProfit = Number(sale.total) - saleCost;

                      return (
                        <tr key={sale.id}>
                          <td style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                            {new Date(sale.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                            <br />
                            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>
                              {new Date(sale.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td style={{ fontSize: 13 }}>{sale.client_name || '—'}</td>
                          <td style={{ fontSize: 12, maxWidth: 300 }}>
                            {items.map((i: { product_name: string; quantity: number }, idx: number) => (
                              <span key={idx}>
                                <strong>{i.quantity}×</strong> {i.product_name}
                                {idx < items.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: 14 }}>
                            ${Number(sale.total).toLocaleString('es-MX')}
                          </td>
                          <td>
                            <span className={`badge ${saleProfit >= 0 ? 'badge-success' : 'badge-danger'}`}>
                              ${saleProfit.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} onClick={() => deleteSale(sale)}>🗑️</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
