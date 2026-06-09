import { Schema, model, Document } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  description: string;
  pointsReward: number;
  durationDays: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    pointsReward: {
      type: Number,
      required: true,
      min: [0, 'Reward points must be positive.'],
    },
    durationDays: {
      type: Number,
      required: true,
      min: [1, 'Duration must be at least 1 day.'],
    },
  },
  {
    timestamps: true,
  }
);

export const Challenge = model<IChallenge>('Challenge', ChallengeSchema);
