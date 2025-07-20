import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String},
  roll: { type: Number, unique: true , require: true },
  password: String,
},{versionKey: false});

export default mongoose.model('users', userSchema);