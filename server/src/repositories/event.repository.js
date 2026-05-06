import Event from '../models/Event.js';

export const findAll = (filter = {}, options = {}) => {
  const { page = 1, limit = 20 } = options;
  return Event.find({ isActive: true, ...filter })
    .populate('organizer', 'name avatar')
    .populate('attendees', 'name photo')
    .sort({ date: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};

export const findById = (id) =>
  Event.findById(id)
    .populate('organizer', 'name avatar')
    .populate('attendees', 'name photo phone')
    .populate('checkIns.member', 'name photo');

export const findUpcoming = (limit = 5) =>
  Event.find({ isActive: true, date: { $gte: new Date() } })
    .sort({ date: 1 })
    .limit(limit)
    .lean();

export const create = (data) => Event.create(data);

export const update = (id, data) =>
  Event.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const remove = (id) => Event.findByIdAndUpdate(id, { isActive: false }, { new: true });

export const addCheckIn = (id, memberId) =>
  Event.findByIdAndUpdate(
    id,
    { $addToSet: { checkIns: { member: memberId, checkedInAt: new Date() } } },
    { new: true }
  );

export const countAll = () => Event.countDocuments({ isActive: true });

export const countThisMonth = () => {
  const start = new Date(); start.setDate(1); start.setHours(0, 0, 0, 0);
  const end = new Date(); end.setMonth(end.getMonth() + 1); end.setDate(0); end.setHours(23, 59, 59);
  return Event.countDocuments({ isActive: true, date: { $gte: start, $lte: end } });
};
