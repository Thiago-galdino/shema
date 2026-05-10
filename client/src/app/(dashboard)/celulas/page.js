'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { getInitials, meetingDayLabels } from '@/lib/utils';
import styles from './celulas.module.css';

export default function CelulasPage() {
  const [cells, setCells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCell, setEditCell] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', meetingDay: 'quinta', meetingTime: '19:30', location: '', ministry: '' });
  const [saving, setSaving] = useState(false);

  const fetchCells = useCallback(async () => {
    setLoading(true);
    try { const d = await api.get('/cells'); setCells(d.cells || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const loadCells = async () => { await fetchCells(); };
    loadCells();
  }, [fetchCells]);

  const openCreate = () => { setEditCell(null); setForm({ name: '', description: '', meetingDay: 'quinta', meetingTime: '19:30', location: '', ministry: '' }); setShowModal(true); };
  const openEdit = (c) => { setEditCell(c); setForm({ name: c.name, description: c.description || '', meetingDay: c.meetingDay, meetingTime: c.meetingTime, location: c.location || '', ministry: c.ministry || '' }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editCell) await api.put(`/cells/${editCell._id}`, form);
      else await api.post('/cells', form);
      setShowModal(false); fetchCells();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remover esta célula?')) return;
    try {
      await api.delete(`/cells/${id}`);
      await fetchCells();
    } catch (e) {
      toast.error(`Erro ao excluir: ${e.message}`);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Células & Ministérios</h1>
          <p className="page-subtitle">{cells.length} ativa{cells.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Nova Célula</button>
      </div>

      {loading ? (
        <div className="grid-3">{[1,2,3].map(i => <div key={i} className="card skeleton" style={{ height: 180 }} />)}</div>
      ) : cells.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">🏠</div><h3>Nenhuma célula cadastrada</h3></div>
      ) : (
        <div className="grid-3">
          {cells.map(c => (
            <div key={c._id} className={`card ${styles.cellCard}`}>
              <div className={styles.cellHeader}>
                <div className={styles.cellIcon}>🏠</div>
                <div className={styles.cellInfo}>
                  <div className={styles.cellName}>{c.name}</div>
                  {c.ministry && <div className={styles.cellMinistry}>{c.ministry}</div>}
                </div>
              </div>

              <div className={styles.cellMeta}>
                <div className={styles.metaItem}><span>📅</span> {meetingDayLabels[c.meetingDay]} às {c.meetingTime}</div>
                {c.location && <div className={styles.metaItem}><span>📍</span> {c.location}</div>}
                {c.leader && <div className={styles.metaItem}><span>👤</span> Líder: {c.leader.name}</div>}
              </div>

              <div className={styles.memberChips}>
                {(c.members || []).slice(0, 5).map(m => (
                  <div key={m._id} className="avatar avatar-sm" title={m.name} style={{ background: 'var(--primary)', color: 'var(--accent)', fontSize: '0.65rem' }}>
                    {getInitials(m.name)}
                  </div>
                ))}
                {(c.members || []).length > 5 && <div className={styles.moreChip}>+{c.members.length - 5}</div>}
              </div>

              <div className={styles.cellActions}>
                <span className={styles.memberCount}>{c.members?.length || 0} membros</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); openEdit(c); }}>✏️</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); handleDelete(c._id); }}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editCell ? 'Editar Célula' : 'Nova Célula'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Nome *</label><input className="form-input" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Descrição</label><textarea className="form-textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Dia da Reunião</label>
                    <select className="form-select" value={form.meetingDay} onChange={e => setForm(p => ({ ...p, meetingDay: e.target.value }))}>
                      {Object.entries(meetingDayLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Horário</label><input type="time" className="form-input" value={form.meetingTime} onChange={e => setForm(p => ({ ...p, meetingTime: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Local</label><input className="form-input" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Ministério</label><input className="form-input" value={form.ministry} onChange={e => setForm(p => ({ ...p, ministry: e.target.value }))} /></div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <><div className="spinner" /> Salvando...</> : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
