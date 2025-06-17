import mongoose, { Schema, models, model } from 'mongoose';

const HabitSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userEmail: { type: String, required: true },
  name: { type: String, required: true },
  logs: [
    {
      date: { type: Date, required: true },
      completed: { type: Boolean, default: false },
      note: { type: String }
    }
  ]
}, { timestamps: true });

export default models.Habit || model("Habit", HabitSchema);
