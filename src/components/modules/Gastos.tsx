'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Expense, DEFAULT_EXPENSE_CATEGORIES } from '@/lib/types';

export default function Gastos() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_EXPENSE_CATEGORIES);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ category: '', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadExpenses();
      loadCategories();
    }
  }, [user, period]);

  const loadCategories = async () => {
    const { data } = await supabase.from('settings').select('expense_categories').eq('user_id', user!.id).single();
    if (data?.expense_categories) {
      const cats = Array.isArray(data.expense_categories)
        ? data.expense_categories
        : JSON.parse(data.expense_categories || '[]');
      if (cats.length > 0) setCategories(cats);
    }
  };

  const loadExpenses = async () => {
    setLoading(true);
    let query = supabase.from('expenses').select('*').eq('user_id', user!.id).order('date', { ascending: false });

    if (period !== 'all') {
      const now = new Date();
      const from = new Date(now);
      if (period === 'week') from.setDate(from.getDate() - 7);
      else from.setDate(from.getDate() - 30);
      query = query.gte('date', from.toISOString().split('T')[0]);
    }

    const { data } = await query;
    setExpenses(data || []);
    setLoading(false);
  };

  const openModal = () => {
    setForm({ category: categories[0] || '', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const handleSave = async () => {
    await supabase.from('expenses').insert({
      user_id: user!.id,
      category: form.category,
      description: form.description,
      amount: parseFloat(form.amount) || 0,
      date: form.date,
    });
    setShowModal(false);
    loadExpenses();
  };

  const deleteExpense = async (id: string) => {
    if (!confirm('¿Eliminar este gasto?')) return;
    await supabase.from('expenses').delete().eq('id', id);
    loadExpenses();
  };

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const byCategory: Record<string, number> = {};
  expenses.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount); });

  return (
    <>
      <div className="page-header">
        <h1>💸 Gastos</h1>
        <p>Control de gastos del negocio</p>
      </div>
      <div className="page-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon red">💸</div>
            <div className="stat-value">${total.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</div>
            <div className="stat-label">Total gastos</div>
          </div>
          {Object.entries(byCategory).slice(0, 3).map(([cat, amt]) => (
            <div key={cat} className="stat-card">
              <div className="stat-icon orange">📌</div>
              <div className="stat-value" style={{ fontSize: 20 }}>${amt.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</div>
              <div className="stat-label">{cat}</div>
            </div>
          ))}
        </div>

        <div className="filters-row">
          <div className="tabs" style={{ marginBottom: 0, border: 'none' }}>
            <button className={`tab ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>Semana</button>
            <button className={`tab ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>Mes</button>
            <button className={`tab ${period === 'all' ? 'active' : ''}`} onClick={() => setPeriod('all')}>Todo</button>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn btn-primary" onClick={openModal}>+ Registrar Gasto</button>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            {expenses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💸</div>
                <h3>Sin gastos</h3>
                <p>No hay gastos registrados en este periodo</p>
                <button className="btn btn-primary" onClick={openModal}>Registrar Gasto</button>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Categoría</th>
                      <th>Descripción</th>
                      <th>Monto</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(e => (
                      <tr key={e.id}>
                        <td style={{ fontSize: 13 }}>{new Date(e.date + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td><span className="badge badge-warning">{e.category}</span></td>
                        <td style={{ fontSize: 13 }}>{e.description || '—'}</td>
                        <td style={{ fontWeight: 700, color: 'var(--danger)' }}>${Number(e.amount).toLocaleString('es-MX')}</td>
                        <td>
                          <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} onClick={() => deleteExpense(e.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>💸 Registrar Gasto</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    Puedes añadir más categorías desde ⚙️ Configuración
                  </p>
                </div>
                <div className="form-group">
                  <label className="form-label">Monto ($)</label>
                  <input className="form-input" type="number" step="0.50" value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" autoFocus />
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <input className="form-input" type="date" value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción (opcional)</label>
                  <input className="form-input" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ej: 200 etiquetas grandes" />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={!form.amount}>Registrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
