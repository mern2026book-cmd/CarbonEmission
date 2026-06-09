import { Schema, model, Document, Types } from 'mongoose';

export interface IFootprint extends Document {
  userId: Types.ObjectId;
  energyEmission: number;
  transportEmission: number;
  foodEmission: number;
  totalEmission: number;
  suggestions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FootprintSchema = new Schema<IFootprint>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    energyEmission: {
      type: Number,
      required: true,
      min: [0, 'Energy emission must be positive.'],
    },
    transportEmission: {
      type: Number,
      required: true,
      min: [0, 'Transport emission must be positive.'],
    },
    foodEmission: {
      type: Number,
      required: true,
      min: [0, 'Food emission must be positive.'],
    },
    totalEmission: {
      type: Number,
      required: true,
      min: [0, 'Total emission must be positive.'],
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Footprint = model<IFootprint>('Footprint', FootprintSchema);
