'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Product, PRODUCT_CATEGORIES } from '@/lib/types';
import { PRODUCT_SIZES } from '@/lib/seed-data';

export default function Productos() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', cost: '', suggested_price: '', sale_price: '', category: 'Otros', size: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadProducts(); }, [user]);

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').eq('user_id', user!.id).order('name');
    setProducts(data || []);
    setLoading(false);
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', cost: '', suggested_price: '', sale_price: '', category: 'Otros', size: '' });
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      cost: String(p.cost),
      suggested_price: String(p.suggested_price),
      sale_price: String(p.sale_price),
      category: p.category,
      size: p.size,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const data = {
      name: form.name,
      cost: parseFloat(form.cost) || 0,
      suggested_price: parseFloat(form.suggested_price) || 0,
      sale_price: parseFloat(form.sale_price) || 0,
      category: form.category,
      size: form.size,
      user_id: user!.id,
    };

    if (editing) {
      await supabase.from('products').update({ ...data, updated_at: new Date().toISOString() }).eq('id', editing.id);
    } else {
      await supabase.from('products').insert({ ...data, stock: 0, active: true });
    }

    setShowModal(false);
    loadProducts();
  };

  const toggleActive = async (p: Product) => {
    await supabase.from('products').update({ active: !p.active }).eq('id', p.id);
    loadProducts();
  };

  const deleteProduct = async (p: Product) => {
    if (confirm(`¿Eliminar "${p.name}" permanentemente?`)) {
      await supabase.from('products').delete().eq('id', p.id);
      loadProducts();
    }
  };

  const categories = [...new Set(products.map(p => p.category))].sort();

  return (
    <>
      <div className="page-header">
        <h1>🥜 Productos</h1>
        <p>{products.filter(p => p.active).length} productos activos</p>
      </div>
      <div className="page-content">
        {/* Toolbar */}
        <div className="filters-row">
          <div className="search-bar" style={{ flex: 1, maxWidth: 360 }}>
            <span className="search-icon">🔍</span>
            <input placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: 180 }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn btn-primary" onClick={openNew}>+ Nuevo Producto</button>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Tamaño</th>
                    <th>Costo</th>
                    <th>P. Venta</th>
                    <th>Ganancia</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} style={{ opacity: p.active ? 1 : 0.5 }}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.category}</div>
                      </td>
                      <td style={{ fontSize: 13 }}>{p.size}</td>
                      <td style={{ fontSize: 13, fontWeight: 600 }}>${Number(p.cost).toFixed(0)}</td>
                      <td style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-dark)' }}>${Number(p.sale_price).toFixed(0)}</td>
                      <td>
                        <span className="badge badge-success">${(Number(p.sale_price) - Number(p.cost)).toFixed(0)}</span>
                      </td>
                      <td>
                        <span className={`badge ${p.stock === 0 ? 'badge-danger' : p.stock <= 2 ? 'badge-warning' : 'badge-success'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${p.active ? 'badge-success' : 'badge-danger'}`}>
                          {p.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-sm btn-outline" onClick={() => openEdit(p)}>✏️</button>
                          <button className="btn btn-sm btn-outline" onClick={() => toggleActive(p)}>
                            {p.active ? '🔇' : '🔊'}
                          </button>
                          <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} onClick={() => deleteProduct(p)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: ALMENDRA NATURAL 500 GR" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Categoría</label>
                    <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tamaño</label>
                    <select className="form-select" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
                      {PRODUCT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Costo ($)</label>
                    <input className="form-input" type="number" step="0.50" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">P. Sugerido ($)</label>
                    <input className="form-input" type="number" step="0.50" value={form.suggested_price} onChange={(e) => setForm({ ...form, suggested_price: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">P. Venta ($)</label>
                    <input className="form-input" type="number" step="0.50" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={!form.name}>
                  {editing ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
