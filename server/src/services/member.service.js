import * as memberRepo from '../repositories/member.repository.js';
import * as cellRepo from '../repositories/cell.repository.js';
import { Parser } from 'json2csv';

export const getAll = async (query) => {
  const { page = 1, limit = 20, search, status, cell } = query;
  const filter = {};
  if (status) filter.status = status;
  if (cell) filter.cell = cell;
  const [members, total] = await Promise.all([
    memberRepo.findAll(filter, { page: +page, limit: +limit, search }),
    memberRepo.countAll(filter, search),
  ]);
  return { members, total, page: +page, pages: Math.ceil(total / +limit) };
};

export const getById = async (id) => {
  const member = await memberRepo.findById(id);
  if (!member) { const err = new Error('Membro não encontrado.'); err.statusCode = 404; throw err; }
  return member;
};

export const create = async (data, file) => {
  if (file) data.photo = `/uploads/${file.filename}`;
  
  // Reconstruct address object if flat keys are present (Multipart FormData)
  if (!data.address && (data.address_neighborhood || data.address_city)) {
    data.address = {
      neighborhood: data.address_neighborhood,
      city: data.address_city,
      state: data.address_state || 'CE'
    };
  }
  
  const member = await memberRepo.create(data);
  if (data.cell) {
    await cellRepo.addMember(data.cell, member._id);
  }
  return member;
};

export const update = async (id, data, file) => {
  if (file) data.photo = `/uploads/${file.filename}`;

  // Reconstruct address object if flat keys are present (Multipart FormData)
  if (!data.address && (data.address_neighborhood || data.address_city)) {
    data.address = {
      neighborhood: data.address_neighborhood,
      city: data.address_city,
      state: data.address_state || 'CE'
    };
  }

  const member = await memberRepo.update(id, data);
  if (!member) { const err = new Error('Membro não encontrado.'); err.statusCode = 404; throw err; }
  return member;
};

export const remove = async (id) => {
  const member = await memberRepo.remove(id);
  if (!member) { const err = new Error('Membro não encontrado.'); err.statusCode = 404; throw err; }
  return member;
};

export const exportCSV = async () => {
  const members = await memberRepo.findAll({}, { limit: 9999 });
  const fields = ['name', 'email', 'phone', 'status', 'ministry', 'birthDate', 'baptismDate'];
  const parser = new Parser({ fields });
  return parser.parse(members);
};
