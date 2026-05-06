import mongoose from 'mongoose';

const checkInSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  checkedInAt: { type: Date, default: Date.now },
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  type: {
    type: String,
    enum: ['culto', 'conferencia', 'reuniao', 'celula', 'treinamento', 'outro'],
    default: 'culto',
  },
  date: { type: Date, required: true },
  endDate: { type: Date, default: null },
  location: { type: String, default: '' },
  coverImage: { type: String, default: null },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  checkIns: [checkInSchema],
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isRecurring: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
