'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { eventTypeLabels } from '@/lib/utils';
import styles from './eventos.module.css';

export default function EventosPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [form, setForm] = useState({ title: '', type: 'culto', date: '', location: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (filter) params.set('type', filter);
      const d = await api.get(`/events?${params}`);
      setEvents(d.events || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => {
    const loadEvents = async () => { await fetchEvents(); };
    loadEvents();
  }, [fetchEvents]);

  const openCreate = () => { setEditEvent(null); setForm({ title: '', type: 'culto', date: '', location: '', description: '' }); setShowModal(true); };
  const openEdit = (ev) => { setEditEvent(ev); setForm({ title: ev.title, type: ev.type, date: ev.date ? ev.date.slice(0, 16) : '', location: ev.location || '', description: ev.description || '' }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editEvent) await api.put(`/events/${editEvent._id}`, form);
      else await api.post('/events', form);
      setShowModal(false); fetchEvents();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remover este evento?')) return;
    try {
      await api.delete(`/events/${id}`);
      await fetchEvents();
    } catch (e) {
      alert(`Erro ao excluir: ${e.message}`);
    }
  };

  const typeColors = { culto: '#FEE2E2', conferencia: '#DBEAFE', reuniao: '#D1FAE5', celula: '#EDE9FE', treinamento: '#FEF3C7', outro: '#F3F4F6' };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Eventos & Cultos</h1>
          <p className="page-subtitle">{events.length} evento{events.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Novo Evento</button>
      </div>

      <div className={styles.filters}>
        {['', 'culto', 'conferencia', 'reuniao', 'celula', 'treinamento'].map(t => (
          <button key={t} className={`btn ${filter === t ? 'btn-dark' : 'btn-outline'} btn-sm`} onClick={() => setFilter(t)}>
            {t === '' ? 'Todos' : eventTypeLabels[t]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid-3">{[1,2,3].map(i => <div key={i} className="card skeleton" style={{ height: 160 }} />)}</div>
      ) : events.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">📅</div><h3>Nenhum evento encontrado</h3></div>
      ) : (
        <div className="grid-3">
          {events.map(ev => {
            const d = new Date(ev.date);
            return (
              <div key={ev._id} className={`card ${styles.eventCard}`} style={{ borderTop: `3px solid ${typeColors[ev.type] || '#eee'}` }}>
                <div className={styles.eventHeader}>
                  <div className={styles.eventDateBox}>
                    <div className={styles.eventDay}>{d.getDate()}</div>
                    <div className={styles.eventMonth}>{d.toLocaleDateString('pt-BR', { month: 'short' })}</div>
                  </div>
                  <div className={styles.eventBody}>
                    <span className={`badge badge-${ev.type}`}>{eventTypeLabels[ev.type]}</span>
                    <div className={styles.eventTitle}>{ev.title}</div>
                    <div className={styles.eventTime}>{d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
                {ev.location && <div className={styles.eventLocation}>📍 {ev.location}</div>}
                {ev.description && <p className={styles.eventDesc}>{ev.description}</p>}
                <div className={styles.eventFooter}>
                  <span className={styles.attendees}>👥 {ev.checkIns?.length || 0} check-ins</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); openEdit(ev); }}>✏️</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); handleDelete(ev._id); }}>🗑</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editEvent ? 'Editar Evento' : 'Novo Evento'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Título *</label><input className="form-input" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Tipo</label>
                    <select className="form-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                      {Object.entries(eventTypeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Data e Hora *</label><input type="datetime-local" className="form-input" required value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Local</label><input className="form-input" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} /></div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Descrição</label><textarea className="form-textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
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
