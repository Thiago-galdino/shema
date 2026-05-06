import * as memberService from '../services/member.service.js';

export const getAll = async (req, res) => {
  const data = await memberService.getAll(req.query);
  res.json({ success: true, ...data });
};

export const getById = async (req, res) => {
  const member = await memberService.getById(req.params.id);
  res.json({ success: true, member });
};

export const create = async (req, res) => {
  const member = await memberService.create(req.body, req.file);
  res.status(201).json({ success: true, member });
};

export const update = async (req, res) => {
  const member = await memberService.update(req.params.id, req.body, req.file);
  res.json({ success: true, member });
};

export const remove = async (req, res) => {
  await memberService.remove(req.params.id);
  res.json({ success: true, message: 'Membro removido com sucesso.' });
};

export const exportCSV = async (req, res) => {
  const csv = await memberService.exportCSV();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="membros.csv"');
  res.send(csv);
};
