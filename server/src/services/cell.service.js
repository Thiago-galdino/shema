import * as cellRepo from '../repositories/cell.repository.js';

export const getAll = () => cellRepo.findAll();

export const getById = async (id) => {
  const cell = await cellRepo.findById(id);
  if (!cell) { const err = new Error('Célula não encontrada.'); err.statusCode = 404; throw err; }
  return cell;
};

export const create = (data) => cellRepo.create(data);

export const update = async (id, data) => {
  const cell = await cellRepo.update(id, data);
  if (!cell) { const err = new Error('Célula não encontrada.'); err.statusCode = 404; throw err; }
  return cell;
};

export const remove = async (id) => {
  const cell = await cellRepo.remove(id);
  if (!cell) { const err = new Error('Célula não encontrada.'); err.statusCode = 404; throw err; }
  return cell;
};

export const registerFrequency = async (id, { date, attendees, notes }) => {
  const cell = await cellRepo.addFrequency(id, { date: new Date(date), attendees, notes });
  if (!cell) { const err = new Error('Célula não encontrada.'); err.statusCode = 404; throw err; }
  return cell;
};

export const addMember = (id, memberId) => cellRepo.addMember(id, memberId);
export const removeMember = (id, memberId) => cellRepo.removeMember(id, memberId);
