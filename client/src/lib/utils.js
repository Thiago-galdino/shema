export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('pt-BR');
};

export const formatPhone = (phone) => {
  if (!phone) return '—';
  return phone;
};

export const getInitials = (name = '') => {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
};

export const statusColors = {
  visitante: { bg: '#FFF3CD', color: '#856404', label: 'Visitante' },
  membro: { bg: '#D1FAE5', color: '#065F46', label: 'Membro' },
  lider: { bg: '#DBEAFE', color: '#1E40AF', label: 'Líder' },
  discipulado: { bg: '#EDE9FE', color: '#5B21B6', label: 'Discipulado' },
};

export const eventTypeLabels = {
  culto: 'Culto',
  conferencia: 'Conferência',
  reuniao: 'Reunião',
  celula: 'Célula',
  treinamento: 'Treinamento',
  outro: 'Outro',
};

export const meetingDayLabels = {
  domingo: 'Domingo', segunda: 'Segunda', terca: 'Terça',
  quarta: 'Quarta', quinta: 'Quinta', sexta: 'Sexta', sabado: 'Sábado',
};

export const getAvatarUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith('http')) return photo;
  return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${photo}`;
};

export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'agora';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return formatDate(date);
};
