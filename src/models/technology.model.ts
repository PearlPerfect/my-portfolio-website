import mongoose, { Schema, Document } from 'mongoose';

export interface ITechnology extends Document {
  name: string;
  icon: string;
  category: 'backend' | 'frontend' | 'database' | 'tool' | 'mobile' | 'cloud' | 'ai';
  proficiency: number;
  order: number;
}

const TechnologySchema = new Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  category: {
    type: String,
    enum: ['backend', 'frontend', 'database', 'tool', 'mobile', 'cloud', 'ai'],
    required: true
  },
  proficiency: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  order: { type: Number, default: 0 }
});

export const Technology = mongoose.model<ITechnology>('Technology', TechnologySchema);