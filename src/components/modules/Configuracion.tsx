'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Settings } from '@/lib/types';

export default function Configuracion() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [form, setForm] = useState({
    business_name: '', owner_name: '', address: '', city: '', phone: '',
    split_enabled: true, split_person1_name: '', split_person1_pct: 30,
    split_person2_name: '', split_person2_pct: 70, low_stock_threshold: 2,
  });
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCatIdx, setEditingCatIdx] = useState<number | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (user) loadSettings(); }, [user]);

  const loadSettings = async () => {
    const { data } = await supabase.from('settings').select('*').eq('user_id', user!.id).single();
    if (data) {
      setSettings(data);
      setForm({
        business_name: data.business_name,
        owner_name: data.owner_name,
        address: data.address,
        city: data.city,
        phone: data.phone,
        split_enabled: data.split_enabled,
        split_person1_name: data.split_person1_name,
        split_person1_pct: Number(data.split_person1_pct),
        split_person2_name: data.split_person2_name,
        split_person2_pct: Number(data.split_person2_pct),
        low_stock_threshold: data.low_stock_threshold,
      });
      setExpenseCategories(
        Array.isArray(data.expense_categories)
          ? data.expense_categories
          : JSON.parse(data.expense_categories || '[]')
      );
    }
  };

  // --- Expense category management ---
  const addCategory = () => {
    const name = newCategory.trim();
    if (!name || expenseCategories.includes(name)) return;
    setExpenseCategories([...expenseCategories, name]);
    setNewCategory('');
  };

  const startEditCategory = (idx: number) => {
    setEditingCatIdx(idx);
    setEditingCatName(expenseCategories[idx]);
  };

  const saveEditCategory = () => {
    if (editingCatIdx === null) return;
    const name = editingCatName.trim();
    if (!name) return;
    const updated = [...expenseCategories];
    updated[editingCatIdx] = name;
    setExpenseCategories(updated);
    setEditingCatIdx(null);
    setEditingCatName('');
  };

  const deleteCategory = (idx: number) => {
    if (!confirm(`¿Eliminar la categoría "${expenseCategories[idx]}"?`)) return;
    setExpenseCategories(expenseCategories.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      expense_categories: expenseCategories,
      updated_at: new Date().toISOString(),
    };

    if (settings) {
      await supabase.from('settings').update(payload).eq('id', settings.id);
    } else {
      await supabase.from('settings').insert({ user_id: user!.id, ...payload });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    loadSettings();
  };

  return (
    <>
      <div className="page-header">
        <h1>⚙️ Configuración</h1>
        <p>Ajustes del negocio</p>
      </div>
      <div className="page-content" style={{ maxWidth: 700 }}>
        {saved && (
          <div style={{ background: 'var(--primary-pale)', color: 'var(--primary-dark)', padding: '12px 20px', borderRadius: 8, marginBottom: 20, fontWeight: 600, fontSize: 14 }}>
            ✅ Configuración guardada
          </div>
        )}

        {/* Business Info */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h3>🏪 Datos del Negocio</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Nombre del negocio</label>
              <input className="form-input" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Nombre del dueño</label>
              <input className="form-input" value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input className="form-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Ciudad</label>
                <input className="form-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Profit Split - Editable */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <h3>💰 Reparto de Ganancias</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.split_enabled}
                onChange={(e) => setForm({ ...form, split_enabled: e.target.checked })} />
              Activar
            </label>
          </div>
          {form.split_enabled && (
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <div className="form-group">
                    <label className="form-label">Persona 1</label>
                    <input className="form-input" value={form.split_person1_name}
                      onChange={(e) => setForm({ ...form, split_person1_name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Porcentaje (%)</label>
                    <input className="form-input" type="number" min="0" max="100" value={form.split_person1_pct}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value) || 0;
                        setForm({ ...form, split_person1_pct: v, split_person2_pct: 100 - v });
                      }} />
                  </div>
                </div>
                <div>
                  <div className="form-group">
                    <label className="form-label">Persona 2</label>
                    <input className="form-input" value={form.split_person2_name}
                      onChange={(e) => setForm({ ...form, split_person2_name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Porcentaje (%)</label>
                    <input className="form-input" type="number" min="0" max="100" value={form.split_person2_pct}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value) || 0;
                        setForm({ ...form, split_person2_pct: v, split_person1_pct: 100 - v });
                      }} />
                  </div>
                </div>
              </div>
              <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>
                💡 Ejemplo: Si la ganancia es $1,000 → <strong>{form.split_person1_name || 'Persona 1'}</strong>: ${(1000 * form.split_person1_pct / 100).toFixed(0)} · <strong>{form.split_person2_name || 'Persona 2'}</strong>: ${(1000 * form.split_person2_pct / 100).toFixed(0)}
              </div>
            </div>
          )}
        </div>

        {/* Expense Categories - Editable! */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <h3>💸 Categorías de Gastos</h3>
            <span className="badge badge-info">{expenseCategories.length}</span>
          </div>
          <div className="card-body">
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
              Puedes añadir, editar o eliminar categorías para organizar tus gastos.
            </p>

            {/* Existing categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {expenseCategories.map((cat, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', background: 'var(--bg)', borderRadius: 8,
                  border: '1px solid var(--border-light)',
                }}>
                  {editingCatIdx === idx ? (
                    <>
                      <input className="form-input" value={editingCatName}
                        onChange={(e) => setEditingCatName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEditCategory()}
                        style={{ flex: 1, padding: '6px 10px', fontSize: 13 }} autoFocus />
                      <button className="btn btn-sm btn-primary" onClick={saveEditCategory}>✓</button>
                      <button className="btn btn-sm btn-outline" onClick={() => setEditingCatIdx(null)}>✕</button>
                    </>
                  ) : (
                    <>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>📌 {cat}</span>
                      <button className="btn btn-sm btn-outline" onClick={() => startEditCategory(idx)}
                        style={{ fontSize: 12 }}>✏️</button>
                      <button className="btn btn-sm btn-outline" onClick={() => deleteCategory(idx)}
                        style={{ fontSize: 12, color: 'var(--danger)' }}>🗑️</button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Add new category */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-input" value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                placeholder="Nueva categoría de gasto..."
                style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={addCategory} disabled={!newCategory.trim()}>
                + Añadir
              </button>
            </div>
          </div>
        </div>

        {/* Inventory config */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h3>📦 Inventario</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Alerta de stock bajo (unidades)</label>
              <input className="form-input" type="number" min="0" value={form.low_stock_threshold}
                onChange={(e) => setForm({ ...form, low_stock_threshold: parseInt(e.target.value) || 0 })}
                style={{ maxWidth: 120 }} />
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                Productos con stock igual o menor a este número se mostrarán como alerta
              </p>
            </div>
          </div>
        </div>

        <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving} style={{ width: '100%' }}>
          {saving ? '⏳ Guardando...' : '💾 Guardar Configuración'}
        </button>
      </div>
    </>
  );
}
