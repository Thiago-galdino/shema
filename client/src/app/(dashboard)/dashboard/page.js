'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import api from '@/lib/api';
import { formatDate, getInitials, getAvatarUrl } from '@/lib/utils';
import styles from './dashboard.module.css';

const STATUS_COLORS = { visitante: '#F59E0B', membro: '#10B981', lider: '#3B82F6', discipulado: '#8B5CF6' };

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/dashboard'), api.get('/dashboard/upcoming-events')])
      .then(([kpis, ev]) => { setData(kpis); setEvents(ev.events || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page-wrapper">
      <div className="page-header">
        <div><div className={styles.skelTitle} /><div className={styles.skelSub} /></div>
      </div>
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {[1,2,3,4].map(i => <div key={i} className={`card skeleton`} style={{ height: 110 }} />)}
      </div>
    </div>
  );

  const pieData = data ? [
    { name: 'Visitante', value: data.byStatus.visitante, color: STATUS_COLORS.visitante },
    { name: 'Membro', value: data.byStatus.membro, color: STATUS_COLORS.membro },
    { name: 'Líder', value: data.byStatus.lider, color: STATUS_COLORS.lider },
    { name: 'Discipulado', value: data.byStatus.discipulado, color: STATUS_COLORS.discipulado },
  ] : [];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Visão Geral</h1>
          <p className="page-subtitle">Acompanhe o crescimento da Igreja Batista Shema</p>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total de Membros', value: data?.totalMembers ?? 0, icon: '👥', color: 'var(--primary)' },
          { label: 'Células Ativas', value: data?.totalCells ?? 0, icon: '🏠', color: 'var(--success)' },
          { label: 'Eventos Totais', value: data?.totalEvents ?? 0, icon: '📅', color: 'var(--accent)' },
          { label: 'Eventos este Mês', value: data?.eventsThisMonth ?? 0, icon: '🗓️', color: 'var(--info)' },
        ].map((kpi, i) => (
          <div key={i} className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiIcon} style={{ background: `${kpi.color}15`, color: kpi.color }}>{kpi.icon}</div>
            <div className={styles.kpiValue}>{kpi.value}</div>
            <div className={styles.kpiLabel}>{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <h3 className={styles.chartTitle}>Crescimento de Membros</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data?.growthData || []}>
              <defs>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }} />
              <Area type="monotone" dataKey="members" stroke="var(--accent)" fill="url(#gradBlue)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className={styles.chartTitle}>Membros por Status</h3>
          <div className={styles.pieWrapper}>
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={pieData} innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.pieLegend}>
              {pieData.map(d => (
                <div key={d.name} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: d.color }} />
                  <span className={styles.legendName}>{d.name}</span>
                  <span className={styles.legendVal}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <h3 className={styles.chartTitle}>🎂 Aniversariantes do Mês</h3>
          {data?.birthdays?.length === 0 ? (
            <div className={styles.emptyBox}>Nenhum aniversariante este mês.</div>
          ) : (
            <div className={styles.simpleList}>
              {(data?.birthdays || []).map(m => (
                <div key={m._id} className={styles.simpleItem}>
                  <div className="avatar avatar-sm">
                    {m.photo ? <Image src={getAvatarUrl(m.photo)} alt={m.name || 'Avatar'} width={40} height={40} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(m.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{m.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(m.birthDate).getDate()} de {new Date(m.birthDate).toLocaleDateString('pt-BR', { month: 'long' })}</div>
                  </div>
                  <button className="btn btn-ghost btn-sm">🎉</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className={styles.chartTitle}>✨ Novos Membros</h3>
          <div className={styles.simpleList}>
            {(data?.recentMembers || []).map(m => (
              <div key={m._id} className={styles.simpleItem}>
                <div className="avatar avatar-sm" style={{ background: 'var(--success)', color: '#fff' }}>
                  {m.photo ? <Image src={getAvatarUrl(m.photo)} alt={m.name || 'Avatar'} width={40} height={40} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(m.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{m.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Entrou em {formatDate(m.createdAt)}</div>
                </div>
                <span className="badge badge-membro" style={{ fontSize: '0.65rem' }}>Novo</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className={styles.chartTitle} style={{ marginBottom: '1rem' }}>Próximos Eventos</h3>
        {events.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📅</div><h3>Nenhum evento próximo</h3></div>
        ) : (
          <div className={styles.eventList}>
            {events.map(ev => (
              <div key={ev._id} className={styles.eventItem}>
                <div className={styles.eventDate}>
                  <div className={styles.eventDay}>{new Date(ev.date).getDate()}</div>
                  <div className={styles.eventMonth}>{new Date(ev.date).toLocaleDateString('pt-BR', { month: 'short' })}</div>
                </div>
                <div className={styles.eventInfo}>
                  <div className={styles.eventTitle}>{ev.title}</div>
                  <div className={styles.eventMeta}>{ev.location || '—'} • {new Date(ev.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <span className={`badge badge-${ev.type}`}>{ev.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
