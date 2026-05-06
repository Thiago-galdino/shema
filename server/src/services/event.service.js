import * as eventRepo from '../repositories/event.repository.js';

export const getAll = (query) => {
  const { page = 1, limit = 20, type, from, to } = query;
  const filter = {};
  if (type) filter.type = type;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }
  return eventRepo.findAll(filter, { page: +page, limit: +limit });
};

export const getById = async (id) => {
  const event = await eventRepo.findById(id);
  if (!event) { const err = new Error('Evento não encontrado.'); err.statusCode = 404; throw err; }
  return event;
};

export const create = (data, userId) => eventRepo.create({ ...data, organizer: userId });

export const update = async (id, data) => {
  const event = await eventRepo.update(id, data);
  if (!event) { const err = new Error('Evento não encontrado.'); err.statusCode = 404; throw err; }
  return event;
};

export const remove = async (id) => {
  const event = await eventRepo.remove(id);
  if (!event) { const err = new Error('Evento não encontrado.'); err.statusCode = 404; throw err; }
  return event;
};

export const checkIn = async (eventId, memberId) => {
  const event = await eventRepo.addCheckIn(eventId, memberId);
  if (!event) { const err = new Error('Evento não encontrado.'); err.statusCode = 404; throw err; }
  return event;
};
