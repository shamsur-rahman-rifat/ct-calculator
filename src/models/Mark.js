import mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
  roll: { type: Number },
  name: { type: String},
  ct1: { type: Number, default: 0 },
  ct2: { type: Number, default: 0 },
  ct3: { type: Number, default: 0 },
  ct4: { type: Number, default: 0 },
},{versionKey: false});

export default mongoose.model('marks', markSchema);