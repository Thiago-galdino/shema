import Member from '../models/Member.js';

export const findAll = (filter = {}, options = {}) => {
  const { page = 1, limit = 20, sort = { createdAt: -1 }, search } = options;
  const query = { isActive: true, ...filter };
  if (search) query.$text = { $search: search };
  return Member.find(query)
    .populate('cell', 'name')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};

export const countAll = (filter = {}, search) => {
  const query = { isActive: true, ...filter };
  if (search) query.$text = { $search: search };
  return Member.countDocuments(query);
};

export const findById = (id) => Member.findById(id).populate('cell', 'name meetingDay meetingTime');

export const create = (data) => Member.create(data);

export const update = (id, data) => Member.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('cell', 'name');

export const remove = (id) => Member.findByIdAndUpdate(id, { isActive: false }, { new: true });

export const pushActivity = (id, activity) =>
  Member.findByIdAndUpdate(id, { $push: { activityHistory: activity } }, { new: true });

export const countByStatus = () =>
  Member.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

export const countByMonth = () =>
  Member.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

export const findBirthdaysMonth = (limit = 5) => {
  const currentMonth = new Date().getMonth() + 1;
  return Member.find({
    isActive: true,
    birthDate: { $exists: true },
    $expr: { $eq: [{ $month: '$birthDate' }, currentMonth] }
  }).limit(limit).select('name birthDate photo');
};

export const findRecent = (limit = 5) => {
  return Member.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('name createdAt photo');
};
