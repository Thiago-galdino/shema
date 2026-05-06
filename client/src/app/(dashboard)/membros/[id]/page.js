'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { formatDate, getInitials, statusColors, getAvatarUrl } from '@/lib/utils';
import styles from './member-detail.module.css';

export default function MemberDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/members/${id}`)
      .then(data => setMember(data.member))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-wrapper"><div className="card skeleton" style={{ height: 400 }} /></div>;
  if (!member) return <div className="page-wrapper"><h3>Membro não encontrado</h3></div>;

  const sc = statusColors[member.status] || {};

  return (
    <div className="page-wrapper">
      <div className={styles.header}>
        <button className="btn btn-ghost btn-sm" onClick={() => router.back()}>← Voltar</button>
        <div className={styles.actions}>
          <button className="btn btn-outline btn-sm">✏️ Editar Perfil</button>
          <button className="btn btn-danger btn-sm">🗑 Remover</button>
        </div>
      </div>

      <div className={styles.profileGrid}>
        <div className={styles.mainInfo}>
          <div className="card">
            <div className={styles.profileTop}>
              <div className="avatar avatar-xl" style={{ fontSize: '2.5rem' }}>
                {member.photo ? <Image src={getAvatarUrl(member.photo)} alt={member.name} width={120} height={120} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(member.name)}
              </div>
              <div className={styles.profileTitles}>
                <h1 className={styles.name}>{member.name}</h1>
                <div className={styles.badgeRow}>
                  <span className="badge" style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                  {member.ministry && <span className="badge" style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}>{member.ministry}</span>}
                </div>
              </div>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Email</label>
                <div>{member.email || '—'}</div>
              </div>
              <div className={styles.infoItem}>
                <label>Telefone / WhatsApp</label>
                <div>{member.phone || member.whatsapp || '—'}</div>
              </div>
              <div className={styles.infoItem}>
                <label>Data de Nascimento</label>
                <div>{formatDate(member.birthDate)}</div>
              </div>
              <div className={styles.infoItem}>
                <label>Data de Batismo</label>
                <div>{member.baptismDate ? formatDate(member.baptismDate) : 'Não batizado'}</div>
              </div>
              <div className={styles.infoItem} style={{ gridColumn: '1 / -1' }}>
                <label>Endereço</label>
                <div>{member.address?.neighborhood}, {member.address?.city} - {member.address?.state || 'CE'}</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3 className={styles.sectionTitle}>Célula e Ministérios</h3>
            {member.cell ? (
              <div className={styles.cellBox}>
                <div className={styles.cellIcon}>🏠</div>
                <div className={styles.cellInfo}>
                  <div className={styles.cellName}>{member.cell.name}</div>
                  <div className={styles.cellMeta}>Reuniões: {member.cell.meetingDay} às {member.cell.meetingTime}</div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => router.push(`/celulas`)}>Ver Célula</button>
              </div>
            ) : (
              <div className={styles.emptyBox}>Não participa de nenhuma célula atualmente.</div>
            )}
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className="card">
            <h3 className={styles.sectionTitle}>Histórico & Atividade</h3>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <div className={styles.timelineDate}>{formatDate(member.createdAt)}</div>
                  <div className={styles.timelineText}>Cadastro realizado na plataforma</div>
                </div>
              </div>
              {member.baptismDate && (
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDot} style={{ background: 'var(--info)' }} />
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineDate}>{formatDate(member.baptismDate)}</div>
                    <div className={styles.timelineText}>Batismo nas águas celebrado</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3 className={styles.sectionTitle}>Ações Rápidas</h3>
            <div className={styles.quickActions}>
              <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }}>✉️ Enviar Email</button>
              <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }}>💬 Chamar no WhatsApp</button>
              <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }}>📋 Gerar Ficha Cadastral</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
