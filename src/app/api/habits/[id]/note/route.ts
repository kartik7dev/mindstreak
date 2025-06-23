import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Habit from "@/app/models/Habit";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { note } = await req.json();
    const habitId = params.id;

    await connectToDatabase();

    const habit = await Habit.findById(habitId);
    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLog = habit.logs.find((log: any) => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });

    if (!todayLog) {
      return NextResponse.json({ error: "No log found for today" }, { status: 404 });
    }

    todayLog.note = note;

    await habit.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating note:", err);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}
