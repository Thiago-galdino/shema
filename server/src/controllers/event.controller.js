import * as eventService from '../services/event.service.js';

export const getAll = async (req, res) => {
  const events = await eventService.getAll(req.query);
  res.json({ success: true, events });
};

export const getById = async (req, res) => {
  const event = await eventService.getById(req.params.id);
  res.json({ success: true, event });
};

export const create = async (req, res) => {
  const event = await eventService.create(req.body, req.user._id);
  res.status(201).json({ success: true, event });
};

export const update = async (req, res) => {
  const event = await eventService.update(req.params.id, req.body);
  res.json({ success: true, event });
};

export const remove = async (req, res) => {
  await eventService.remove(req.params.id);
  res.json({ success: true, message: 'Evento removido com sucesso.' });
};

export const checkIn = async (req, res) => {
  const event = await eventService.checkIn(req.params.id, req.body.memberId);
  res.json({ success: true, event });
};
