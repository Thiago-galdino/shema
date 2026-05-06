import * as memberRepo from '../repositories/member.repository.js';
import * as cellRepo from '../repositories/cell.repository.js';
import * as eventRepo from '../repositories/event.repository.js';

export const getKPIs = async () => {
  const [totalMembers, totalCells, totalEvents, eventsThisMonth, byStatus, byMonth, birthdays, recentMembers] = await Promise.all([
    memberRepo.countAll(),
    cellRepo.countAll(),
    eventRepo.countAll(),
    eventRepo.countThisMonth(),
    memberRepo.countByStatus(),
    memberRepo.countByMonth(),
    memberRepo.findBirthdaysMonth(5),
    memberRepo.findRecent(5),
  ]);

  const statusMap = {};
  byStatus.forEach(({ _id, count }) => { statusMap[_id] = count; });

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const growthData = byMonth.map(({ _id, count }) => ({
    month: months[_id.month - 1],
    members: count,
  }));

  return {
    totalMembers,
    totalCells,
    totalEvents,
    eventsThisMonth,
    birthdays,
    recentMembers,
    byStatus: {
      visitante: statusMap.visitante || 0,
      membro: statusMap.membro || 0,
      lider: statusMap.lider || 0,
      discipulado: statusMap.discipulado || 0,
    },
    growthData,
  };
};

export const getUpcomingEvents = () => eventRepo.findUpcoming(5);
