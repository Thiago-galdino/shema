import * as dashboardService from '../services/dashboard.service.js';

export const getKPIs = async (req, res) => {
  const data = await dashboardService.getKPIs();
  res.json({ success: true, ...data });
};

export const getUpcomingEvents = async (req, res) => {
  const events = await dashboardService.getUpcomingEvents();
  res.json({ success: true, events });
};
