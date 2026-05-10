import Cell from '../models/Cell.js';

export const findAll = (filter = {}) =>
  Cell.find({ isActive: true, ...filter })
    .populate('leader', 'name photo status')
    .populate('members', 'name photo status')
    .sort({ name: 1 })
    .lean();

export const findById = (id) =>
  Cell.findOne({ _id: id, isActive: true })
    .populate('leader', 'name photo phone')
    .populate('members', 'name photo status phone');

export const create = (data) => Cell.create(data);

export const update = (id, data) =>
  Cell.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('leader', 'name photo')
    .populate('members', 'name photo');

export const remove = (id) => Cell.findByIdAndUpdate(id, { isActive: false }, { new: true });

export const addFrequency = (id, frequencyData) =>
  Cell.findByIdAndUpdate(id, { $push: { frequency: frequencyData } }, { new: true });

export const addMember = (id, memberId) =>
  Cell.findByIdAndUpdate(id, { $addToSet: { members: memberId } }, { new: true });

export const removeMember = (id, memberId) =>
  Cell.findByIdAndUpdate(id, { $pull: { members: memberId } }, { new: true });

export const countAll = () => Cell.countDocuments({ isActive: true });
