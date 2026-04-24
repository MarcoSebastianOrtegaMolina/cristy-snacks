'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Product } from '@/lib/types';

export default function Inventario() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [showAdjust, setShowAdjust] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustType, setAdjustType] = useState<'in' | 'adjustment'>('in');
  const [adjustReason, setAdjustReason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadProducts(); }, [user]);

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').eq('user_id', user!.id).eq('active', true).order('name');
    setProducts(data || []);
    setLoading(false);
  };

  const quickAdjust = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    await supabase.from('products').update({ stock: newStock }).eq('id', product.id);

    await supabase.from('inventory_movements').insert({
      user_id: user!.id,
      product_id: product.id,
      product_name: product.name,
      type: delta > 0 ? 'in' : 'adjustment',
      quantity: Math.abs(delta),
      reason: delta > 0 ? 'Entrada rápida' : 'Ajuste rápido',
    });

    loadProducts();
  };

  const handleAdjust = async () => {
    if (!showAdjust || !adjustQty) return;
    const qty = parseInt(adjustQty);
    if (isNaN(qty) || qty <= 0) return;

    const newStock = adjustType === 'in' ? showAdjust.stock + qty : qty;

    await supabase.from('products').update({ stock: newStock }).eq('id', showAdjust.id);
    await supabase.from('inventory_movements').insert({
      user_id: user!.id,
      product_id: showAdjust.id,
      product_name: showAdjust.name,
      type: adjustType,
      quantity: qty,
      reason: adjustReason || (adjustType === 'in' ? 'Entrada de mercancía' : 'Ajuste de inventario'),
    });

    setShowAdjust(null);
    setAdjustQty('');
    setAdjustReason('');
    loadProducts();
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);
  const totalValue = products.reduce((s, p) => s + (p.stock * p.cost), 0);

  return (
    <>
      <div className="page-header">
        <h1>📦 Inventario</h1>
        <p>{totalUnits} unidades · Valor: ${totalValue.toLocaleString('es-MX')}</p>
      </div>
      <div className="page-content">
        <div className="stats-grid" style={{ marginBottom: 20 }}>
          <div className="stat-card">
            <div className="stat-icon green">📦</div>
            <div className="stat-value">{totalUnits}</div>
            <div className="stat-label">Unidades totales</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">💼</div>
            <div className="stat-value">${totalValue.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</div>
            <div className="stat-label">Valor del inventario</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">⚠️</div>
            <div className="stat-value">{products.filter(p => p.stock === 0).length}</div>
            <div className="stat-label">Sin stock</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">📊</div>
            <div className="stat-value">{products.filter(p => p.stock > 0 && p.stock <= 2).length}</div>
            <div className="stat-label">Stock bajo</div>
          </div>
        </div>

        <div className="filters-row">
          <div className="search-bar" style={{ flex: 1, maxWidth: 360 }}>
            <span className="search-icon">🔍</span>
            <input placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>Valor</th>
                    <th style={{ textAlign: 'center' }}>Ajustar</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Costo: ${Number(p.cost).toFixed(0)}</div>
                      </td>
                      <td>
                        <span className={`badge ${p.stock === 0 ? 'badge-danger' : p.stock <= 2 ? 'badge-warning' : 'badge-success'}`}
                          style={{ fontSize: 14, padding: '4px 14px' }}>
                          {p.stock}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, fontSize: 13 }}>
                        ${(p.stock * Number(p.cost)).toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                          <button className="btn btn-sm btn-outline" onClick={() => quickAdjust(p, -1)} disabled={p.stock === 0}
                            style={{ fontSize: 16, width: 34, padding: 0 }}>−</button>
                          <button className="btn btn-sm btn-primary" onClick={() => { setShowAdjust(p); setAdjustType('in'); }}
                            style={{ fontSize: 16, width: 34, padding: 0 }}>+</button>
                          <button className="btn btn-sm btn-outline" onClick={() => { setShowAdjust(p); setAdjustType('adjustment'); }}
                            style={{ fontSize: 11 }}>📝</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Adjust Modal */}
        {showAdjust && (
          <div className="modal-overlay" onClick={() => setShowAdjust(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{adjustType === 'in' ? '📦 Entrada de Stock' : '📝 Ajustar Stock'}</h2>
                <button className="modal-close" onClick={() => setShowAdjust(null)}>✕</button>
              </div>
              <div className="modal-body">
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>{showAdjust.name}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
                  Stock actual: <strong>{showAdjust.stock}</strong>
                </p>

                <div className="form-group">
                  <label className="form-label">
                    {adjustType === 'in' ? 'Unidades a agregar' : 'Nuevo stock total'}
                  </label>
                  <input className="form-input" type="number" min="0" value={adjustQty}
                    onChange={(e) => setAdjustQty(e.target.value)} placeholder="0" autoFocus />
                </div>
                <div className="form-group">
                  <label className="form-label">Razón (opcional)</label>
                  <input className="form-input" value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)} placeholder="Ej: Llegó pedido, corrección..." />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setShowAdjust(null)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleAdjust} disabled={!adjustQty}>
                  {adjustType === 'in' ? 'Agregar Stock' : 'Ajustar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
