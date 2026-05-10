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

export const findById = (id) => Member.findOne({ _id: id, isActive: true }).populate('cell', 'name meetingDay meetingTime');

export const create = (data) => Member.create(data);

export const update = (id, data) => Member.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('cell', 'name');

export const remove = (id) => Member.findByIdAndUpdate(id, { isActive: false }, { new: true });

export const pushActivity = (id, activity) =>
  Member.findByIdAndUpdate(id, { $push: { activityHistory: activity } }, { new: true });

export const getDashboardStats = (birthdayLimit = 5, recentLimit = 5) => {
  const currentMonth = new Date().getMonth() + 1;
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  return Member.aggregate([
    { $match: { isActive: true } },
    { $facet: {
      total: [{ $count: 'count' }],
      byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
      byMonth: [
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ],
      birthdays: [
        { $match: { birthDate: { $exists: true, $ne: null }, $expr: { $eq: [{ $month: '$birthDate' }, currentMonth] } } },
        { $limit: birthdayLimit },
        { $project: { name: 1, birthDate: 1, photo: 1 } },
      ],
      recent: [
        { $sort: { createdAt: -1 } },
        { $limit: recentLimit },
        { $project: { name: 1, createdAt: 1, photo: 1 } },
      ],
    }},
  ]);
};
