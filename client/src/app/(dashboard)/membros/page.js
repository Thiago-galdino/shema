'use client';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { statusColors, getInitials, formatDate, getAvatarUrl } from '@/lib/utils';
import styles from './membros.module.css';

export default function MembrosPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', whatsapp: '', email: '', status: 'visitante', ministry: '', birthDate: '', baptismDate: '', 'address.neighborhood': '', 'address.city': 'Fortaleza', photo: null, photoPreview: null });
  const [saving, setSaving] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      const data = await api.get(`/members?${params}`);
      setMembers(data.members || []);
      setTotal(data.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, status]);

  useEffect(() => {
    const loadMembers = async () => { await fetchMembers(); };
    loadMembers();
  }, [fetchMembers]);

  const openCreate = () => { setEditMember(null); setForm({ name: '', phone: '', whatsapp: '', email: '', status: 'visitante', ministry: '', birthDate: '', baptismDate: '', 'address.neighborhood': '', 'address.city': 'Fortaleza', photo: null, photoPreview: null }); setShowModal(true); };
  const openEdit = (m) => { setEditMember(m); setForm({ name: m.name || '', phone: m.phone || '', whatsapp: m.whatsapp || '', email: m.email || '', status: m.status || 'visitante', ministry: m.ministry || '', birthDate: m.birthDate ? m.birthDate.slice(0, 10) : '', baptismDate: m.baptismDate ? m.baptismDate.slice(0, 10) : '', 'address.neighborhood': m.address?.neighborhood || '', 'address.city': m.address?.city || 'Fortaleza', photo: null, photoPreview: getAvatarUrl(m.photo) }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('status', form.status);
      formData.append('phone', form.phone);
      formData.append('whatsapp', form.whatsapp);
      formData.append('email', form.email);
      formData.append('ministry', form.ministry);
      if (form.birthDate) formData.append('birthDate', form.birthDate);
      if (form.baptismDate) formData.append('baptismDate', form.baptismDate);
      formData.append('address_neighborhood', form['address.neighborhood']);
      formData.append('address_city', form['address.city']);
      if (form.photo) formData.append('photo', form.photo);

      if (editMember) await api.put(`/members/${editMember._id}`, formData);
      else await api.post('/members', formData);
      setShowModal(false); fetchMembers();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja remover este membro?')) return;
    try {
      await api.delete(`/members/${id}`);
      await fetchMembers();
    } catch (e) {
      toast.error(`Erro ao excluir: ${e.message}`);
    }
  };

  const exportCSV = async () => {
    const token = localStorage.getItem('shema_token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/export`, { headers: { Authorization: `Bearer ${token}` } });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'membros.csv'; a.click();
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Membros</h1>
          <p className="page-subtitle">{total} cadastrado{total !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline btn-sm" onClick={exportCSV}>⬇ Exportar CSV</button>
          <button className="btn btn-primary" onClick={openCreate}>+ Novo Membro</button>
        </div>
      </div>

      <div className={styles.filters}>
        <input className="form-input" placeholder="🔍 Buscar membro..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
        <select className="form-select" value={status} onChange={e => setStatus(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="">Todos os status</option>
          <option value="visitante">Visitante</option>
          <option value="membro">Membro</option>
          <option value="lider">Líder</option>
          <option value="discipulado">Discipulado</option>
        </select>
      </div>

      {loading ? (
        <div className={styles.grid}>{[1,2,3,4,5,6].map(i => <div key={i} className="card skeleton" style={{ height: 120 }} />)}</div>
      ) : members.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>Nenhum membro encontrado</h3>
          <p>Clique em &apos;Novo Membro&apos; para cadastrar.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {members.map(m => {
            const sc = statusColors[m.status] || {};
            return (
              <div key={m._id} className={`card ${styles.memberCard}`}>
                <div className={styles.cardTop}>
                  <div className="avatar avatar-md" style={{ background: 'var(--primary)', color: 'var(--accent)', cursor: 'pointer' }} onClick={() => router.push(`/membros/${m._id}`)}>
                    {m.photo ? <Image src={getAvatarUrl(m.photo)} alt={m.name} width={56} height={56} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(m.name)}
                  </div>
                  <div className={styles.memberInfo} onClick={() => router.push(`/membros/${m._id}`)} style={{ cursor: 'pointer' }}>
                    <div className={styles.memberName}>{m.name}</div>
                    <div className={styles.memberMeta}>{m.ministry || 'Sem ministério'}</div>
                  </div>
                  <span className="badge" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                </div>
                <div className={styles.cardDetails}>
                  <span>📱 {m.phone || '—'}</span>
                  <span>🏠 {m.address?.neighborhood || '—'}</span>
                  <span>📅 {m.birthDate ? formatDate(m.birthDate) : '—'}</span>
                </div>
                <div className={styles.cardActions}>
                  <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); openEdit(m); }}>✏️ Editar</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); handleDelete(m._id); }}>🗑 Remover</button>
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
              <h2 className="modal-title">{editMember ? 'Editar Membro' : 'Novo Membro'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: '1.5rem', alignItems: 'center' }}>
                  <label className={styles.photoUpload}>
                    <div className="avatar avatar-xl" style={{ border: '2px dashed var(--border)', background: 'var(--bg)' }}>
                      {form.photoPreview ? <Image src={form.photoPreview} alt="Preview" width={700} height={394} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📷'}
                    </div>
                    <input type="file" hidden accept="image/*" onChange={e => {
                      const file = e.target.files[0];
                      if (file) setForm(p => ({ ...p, photo: file, photoPreview: URL.createObjectURL(file) }));
                    }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.5rem', fontWeight: 600 }}>Alterar Foto</span>
                  </label>
                </div>
                <div className="form-grid">
                  <div className="form-group"><label className="form-label">Nome Completo *</label><input className="form-input" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                      <option value="visitante">Visitante</option><option value="membro">Membro</option><option value="lider">Líder</option><option value="discipulado">Discipulado</option>
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Telefone</label><input className="form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">WhatsApp</label><input className="form-input" value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Ministério</label><input className="form-input" value={form.ministry} onChange={e => setForm(p => ({ ...p, ministry: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Data de Nascimento</label><input type="date" className="form-input" value={form.birthDate} onChange={e => setForm(p => ({ ...p, birthDate: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Data de Batismo</label><input type="date" className="form-input" value={form.baptismDate} onChange={e => setForm(p => ({ ...p, baptismDate: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Bairro</label><input className="form-input" value={form['address.neighborhood']} onChange={e => setForm(p => ({ ...p, 'address.neighborhood': e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Cidade</label><input className="form-input" value={form['address.city']} onChange={e => setForm(p => ({ ...p, 'address.city': e.target.value }))} /></div>
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
