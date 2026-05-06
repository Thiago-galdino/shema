import mongoose from 'mongoose';

const frequencySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  notes: { type: String, default: '' },
}, { timestamps: true });

const cellSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
  meetingDay: {
    type: String,
    enum: ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'],
    default: 'quinta',
  },
  meetingTime: { type: String, default: '19:00' },
  location: { type: String, default: '' },
  ministry: { type: String, default: '' },
  frequency: [frequencySchema],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Cell', cellSchema);
