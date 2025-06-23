

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Habit from '@/app/models/Habit';

export async function PATCH(req, { params }) {
  try {
    const habitId = params.id;
    const { note } = await req.json();

    await connectToDatabase();

    const habit = await Habit.findById(habitId);
    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if a log exists for today
    const existingLog = habit.logs.find((log) => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });

    if (existingLog) {
      existingLog.completed = true;
      existingLog.note = note;
    } else {
      habit.logs.push({
        date: today,
        completed: true,
        note,
      });
    }

    await habit.save();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error marking habit as done:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
