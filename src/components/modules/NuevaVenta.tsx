'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Product, SaleItem } from '@/lib/types';

interface NuevaVentaProps {
  onComplete: () => void;
}

export default function NuevaVenta({ onComplete }: NuevaVentaProps) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Map<string, { product: Product; qty: number }>>(new Map());
  const [search, setSearch] = useState('');
  const [clientName, setClientName] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (user) loadProducts(); }, [user]);

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').eq('user_id', user!.id).eq('active', true).order('name');
    setProducts(data || []);
  };

  const addToCart = (product: Product) => {
    const newCart = new Map(cart);
    const existing = newCart.get(product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      newCart.set(product.id, { product, qty: 1 });
    }
    setCart(newCart);
  };

  const updateQty = (productId: string, delta: number) => {
    const newCart = new Map(cart);
    const item = newCart.get(productId);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) newCart.delete(productId);
    }
    setCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = new Map(cart);
    newCart.delete(productId);
    setCart(newCart);
  };

  const cartItems = Array.from(cart.values());
  const total = cartItems.reduce((sum, item) => sum + (item.qty * Number(item.product.sale_price)), 0);
  const totalUnits = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const handleSale = async () => {
    if (cartItems.length === 0) return;
    setSaving(true);

    const saleItems: SaleItem[] = cartItems.map(item => ({
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.qty,
      unit_price: Number(item.product.sale_price),
      unit_cost: Number(item.product.cost),
      subtotal: item.qty * Number(item.product.sale_price),
    }));

    // Create sale
    await supabase.from('sales').insert({
      user_id: user!.id,
      items: saleItems,
      total,
      client_name: clientName || null,
    });

    // Update stock & create movements
    for (const item of cartItems) {
      const newStock = Math.max(0, item.product.stock - item.qty);
      await supabase.from('products').update({ stock: newStock }).eq('id', item.product.id);
      await supabase.from('inventory_movements').insert({
        user_id: user!.id,
        product_id: item.product.id,
        product_name: item.product.name,
        type: 'out',
        quantity: item.qty,
        reason: 'Venta',
      });
    }

    setSuccess(true);
    setCart(new Map());
    setClientName('');
    setSaving(false);

    setTimeout(() => {
      setSuccess(false);
      onComplete();
    }, 2000);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <h1>💰 Nueva Venta</h1>
        <p>Selecciona los productos vendidos</p>
      </div>
      <div className="page-content">
        {success && (
          <div style={{ background: 'var(--primary-pale)', padding: 20, borderRadius: 12, textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 48 }}>✅</div>
            <h3 style={{ color: 'var(--primary-dark)', marginTop: 8 }}>¡Venta registrada!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Total: ${total.toLocaleString('es-MX')}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          {/* Products list */}
          <div>
            <div className="search-bar" style={{ marginBottom: 16 }}>
              <span className="search-icon">🔍</span>
              <input placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="product-grid">
              {filtered.map(p => {
                const inCart = cart.get(p.id);
                return (
                  <div key={p.id} className={`product-item ${inCart ? 'selected' : ''}`}
                    onClick={() => addToCart(p)} style={{ cursor: 'pointer' }}>
                    <div className="product-info">
                      <div className="product-name">{p.name}</div>
                      <div className="product-price">${Number(p.sale_price).toFixed(0)}</div>
                      <div className="product-stock">Stock: {p.stock}</div>
                    </div>
                    {inCart ? (
                      <div className="qty-control" onClick={(e) => e.stopPropagation()}>
                        <button className="qty-btn" onClick={() => updateQty(p.id, -1)}>−</button>
                        <span className="qty-value">{inCart.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(p.id, 1)}>+</button>
                      </div>
                    ) : (
                      <button className="btn btn-sm btn-primary" onClick={(e) => { e.stopPropagation(); addToCart(p); }}>+</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart */}
          <div className="card" style={{ position: 'sticky', top: 20, alignSelf: 'start' }}>
            <div className="card-header">
              <h3>🛒 Carrito</h3>
              <span className="badge badge-success">{totalUnits} uds</span>
            </div>
            <div className="card-body">
              {cartItems.length === 0 && (
                <div className="empty-state" style={{ padding: '30px 10px' }}>
                  <div className="empty-icon">🛒</div>
                  <p>Toca un producto para agregarlo</p>
                </div>
              )}

              {cartItems.map(item => (
                <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {item.qty} × ${Number(item.product.sale_price).toFixed(0)} = <strong>${(item.qty * Number(item.product.sale_price)).toLocaleString('es-MX')}</strong>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div className="qty-control" style={{ transform: 'scale(0.85)' }}>
                      <button className="qty-btn" onClick={() => updateQty(item.product.id, -1)}>−</button>
                      <span className="qty-value">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.product.id, 1)}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--danger)' }}>✕</button>
                  </div>
                </div>
              ))}

              {cartItems.length > 0 && (
                <>
                  <div className="form-group" style={{ marginTop: 16 }}>
                    <label className="form-label">Cliente (opcional)</label>
                    <input className="form-input" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nombre del cliente" />
                  </div>

                  <div style={{ padding: '16px 0', borderTop: '2px solid var(--primary)', marginTop: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 18, fontWeight: 800 }}>Total</span>
                      <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-dark)' }}>
                        ${total.toLocaleString('es-MX')}
                      </span>
                    </div>
                    <button className="btn btn-primary btn-block btn-lg" onClick={handleSale} disabled={saving}>
                      {saving ? '⏳ Registrando...' : '✅ Registrar Venta'}
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
