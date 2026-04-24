'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Product, Settings } from '@/lib/types';
import { generateOrderExcel } from '@/lib/excel-generator';

export default function NuevoPedido() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [quantities, setQuantities] = useState<Map<string, number>>(new Map());
  const [search, setSearch] = useState('');
  const [shipping, setShipping] = useState(0);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      loadProducts();
      loadSettings();
    }
  }, [user]);

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').eq('user_id', user!.id).eq('active', true).order('name');
    setProducts(data || []);
  };

  const loadSettings = async () => {
    const { data } = await supabase.from('settings').select('*').eq('user_id', user!.id).single();
    setSettings(data);
  };

  const setQty = (productId: string, qty: number) => {
    const newQtys = new Map(quantities);
    if (qty <= 0) newQtys.delete(productId);
    else newQtys.set(productId, qty);
    setQuantities(newQtys);
  };

  const orderItems = products.filter(p => quantities.has(p.id)).map(p => ({
    product_name: p.name,
    quantity: quantities.get(p.id)!,
    unit_cost: Number(p.cost),
    subtotal: quantities.get(p.id)! * Number(p.cost),
  }));

  const subtotal = orderItems.reduce((s, i) => s + i.subtotal, 0);
  const totalUnits = orderItems.reduce((s, i) => s + i.quantity, 0);
  const total = subtotal + shipping;

  const handleGenerateExcel = () => {
    generateOrderExcel({
      ownerName: settings?.owner_name || 'CRISTIAN ARMANDO ORTEGA MOLINA',
      address: settings?.address || 'CERRADA VERDI 111 NUEVO HERMOSILLO',
      city: settings?.city || 'HERMOSILLO SONORA',
      items: orderItems,
      shipping,
    });
  };

  const handleSaveOrder = async () => {
    if (orderItems.length === 0) return;
    setSaving(true);

    await supabase.from('orders').insert({
      user_id: user!.id,
      items: orderItems,
      subtotal,
      shipping,
      total,
      status: 'draft',
    });

    handleGenerateExcel();
    setSuccess(true);
    setSaving(false);

    setTimeout(() => {
      setSuccess(false);
      setQuantities(new Map());
    }, 3000);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="page-header">
        <h1>🛒 Hacer Pedido</h1>
        <p>Genera tu pedido al proveedor en formato Excel</p>
      </div>
      <div className="page-content">
        {success && (
          <div style={{ background: 'var(--primary-pale)', padding: 20, borderRadius: 12, textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 48 }}>📥</div>
            <h3 style={{ color: 'var(--primary-dark)', marginTop: 8 }}>¡Pedido guardado y Excel generado!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Revisa tu carpeta de descargas</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
          {/* Product selector */}
          <div>
            <div className="search-bar" style={{ marginBottom: 16 }}>
              <span className="search-icon">🔍</span>
              <input placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="card">
              <div className="card-body" style={{ padding: 0 }}>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Costo Unit.</th>
                        <th>Stock</th>
                        <th style={{ textAlign: 'center' }}>Cantidad</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(p => {
                        const qty = quantities.get(p.id) || 0;
                        return (
                          <tr key={p.id} style={{ background: qty > 0 ? 'var(--primary-pale)' : undefined }}>
                            <td>
                              <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                            </td>
                            <td style={{ fontSize: 13, fontWeight: 600 }}>${Number(p.cost).toFixed(0)}</td>
                            <td>
                              <span className={`badge ${p.stock === 0 ? 'badge-danger' : p.stock <= 2 ? 'badge-warning' : 'badge-success'}`}>
                                {p.stock}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div className="qty-control">
                                  <button className="qty-btn" onClick={() => setQty(p.id, qty - 1)}>−</button>
                                  <span className="qty-value">{qty}</span>
                                  <button className="qty-btn" onClick={() => setQty(p.id, qty + 1)}>+</button>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontWeight: 700, color: qty > 0 ? 'var(--primary-dark)' : 'var(--text-muted)' }}>
                              {qty > 0 ? `$${(qty * Number(p.cost)).toLocaleString('es-MX')}` : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="card" style={{ position: 'sticky', top: 20, alignSelf: 'start' }}>
            <div className="card-header">
              <h3>📋 Resumen del Pedido</h3>
            </div>
            <div className="card-body">
              {/* Order info */}
              <div style={{ background: 'var(--bg)', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 12 }}>
                <strong>{settings?.owner_name || 'CRISTIAN ARMANDO ORTEGA MOLINA'}</strong><br />
                {settings?.address || 'CERRADA VERDI 111 NUEVO HERMOSILLO'}<br />
                {settings?.city || 'HERMOSILLO SONORA'}
              </div>

              {orderItems.length === 0 ? (
                <div className="empty-state" style={{ padding: '30px 10px' }}>
                  <div className="empty-icon">📋</div>
                  <p>Selecciona las cantidades de cada producto</p>
                </div>
              ) : (
                <>
                  {orderItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)', fontSize: 12 }}>
                      <span style={{ flex: 1 }}>{item.quantity}× {item.product_name}</span>
                      <span style={{ fontWeight: 600 }}>${item.subtotal.toLocaleString('es-MX')}</span>
                    </div>
                  ))}

                  <div className="form-group" style={{ marginTop: 16 }}>
                    <label className="form-label">Envío a domicilio ($)</label>
                    <input className="form-input" type="number" value={shipping}
                      onChange={(e) => setShipping(parseFloat(e.target.value) || 0)} />
                  </div>

                  <div style={{ borderTop: '2px solid var(--primary)', padding: '16px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span>Unidades:</span>
                      <strong>{totalUnits}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span>Subtotal:</span>
                      <strong>${subtotal.toLocaleString('es-MX')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span>Envío:</span>
                      <strong>${shipping.toLocaleString('es-MX')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800, color: 'var(--primary-dark)', marginTop: 8 }}>
                      <span>Total:</span>
                      <span>${total.toLocaleString('es-MX')}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                    <button className="btn btn-primary btn-block" onClick={handleSaveOrder} disabled={saving}>
                      {saving ? '⏳...' : '📥 Guardar y Descargar Excel'}
                    </button>
                    <button className="btn btn-outline btn-block" onClick={handleGenerateExcel}>
                      📄 Solo Descargar Excel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
