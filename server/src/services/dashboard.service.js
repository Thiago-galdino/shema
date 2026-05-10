import * as memberRepo from '../repositories/member.repository.js';
import * as cellRepo from '../repositories/cell.repository.js';
import * as eventRepo from '../repositories/event.repository.js';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const getKPIs = async () => {
  const [memberStats, eventStats, totalCells] = await Promise.all([
    memberRepo.getDashboardStats(5, 5),
    eventRepo.getDashboardStats(),
    cellRepo.countAll(),
  ]);

  const { total, byStatus, byMonth, birthdays, recent } = memberStats[0];
  const { total: evTotal, thisMonth } = eventStats[0];

  const statusMap = {};
  byStatus.forEach(({ _id, count }) => { statusMap[_id] = count; });

  return {
    totalMembers: total[0]?.count || 0,
    totalCells,
    totalEvents: evTotal[0]?.count || 0,
    eventsThisMonth: thisMonth[0]?.count || 0,
    birthdays,
    recentMembers: recent,
    byStatus: {
      visitante: statusMap.visitante || 0,
      membro: statusMap.membro || 0,
      lider: statusMap.lider || 0,
      discipulado: statusMap.discipulado || 0,
    },
    growthData: byMonth.map(({ _id, count }) => ({
      month: MONTHS[_id.month - 1],
      members: count,
    })),
  };
};

export const getUpcomingEvents = () => eventRepo.findUpcoming(5);
