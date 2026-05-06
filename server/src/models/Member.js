import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true, default: '' },
  whatsapp: { type: String, trim: true, default: '' },
  email: { type: String, trim: true, lowercase: true, default: '' },
  address: {
    street: { type: String, default: '' },
    neighborhood: { type: String, default: '' },
    city: { type: String, default: 'Fortaleza' },
    state: { type: String, default: 'CE' },
    zipCode: { type: String, default: '' },
  },
  birthDate: { type: Date, default: null },
  baptismDate: { type: Date, default: null },
  ministry: { type: String, default: '' },
  photo: { type: String, default: null },
  status: {
    type: String,
    enum: ['visitante', 'membro', 'lider', 'discipulado'],
    default: 'visitante',
  },
  cell: { type: mongoose.Schema.Types.ObjectId, ref: 'Cell', default: null },
  activityHistory: [activitySchema],
  notes: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

memberSchema.index({ name: 'text', email: 'text', phone: 'text' });

export default mongoose.model('Member', memberSchema);
