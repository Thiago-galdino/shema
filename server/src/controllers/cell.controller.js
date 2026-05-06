import * as cellService from '../services/cell.service.js';

export const getAll = async (req, res) => {
  const cells = await cellService.getAll();
  res.json({ success: true, cells });
};

export const getById = async (req, res) => {
  const cell = await cellService.getById(req.params.id);
  res.json({ success: true, cell });
};

export const create = async (req, res) => {
  const cell = await cellService.create(req.body);
  res.status(201).json({ success: true, cell });
};

export const update = async (req, res) => {
  const cell = await cellService.update(req.params.id, req.body);
  res.json({ success: true, cell });
};

export const remove = async (req, res) => {
  await cellService.remove(req.params.id);
  res.json({ success: true, message: 'Célula removida com sucesso.' });
};

export const registerFrequency = async (req, res) => {
  const cell = await cellService.registerFrequency(req.params.id, req.body);
  res.json({ success: true, cell });
};

export const addMember = async (req, res) => {
  const cell = await cellService.addMember(req.params.id, req.body.memberId);
  res.json({ success: true, cell });
};

export const removeMember = async (req, res) => {
  const cell = await cellService.removeMember(req.params.id, req.params.memberId);
  res.json({ success: true, cell });
};
