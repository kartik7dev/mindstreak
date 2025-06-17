import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Habit from "../../../models/Habit";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const habitId = params.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await connectToDatabase();
  const habit = await Habit.findById(habitId);

  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }

  // Find if a log for today exists
  const todayLog = habit.logs.find(
    (log: any) => new Date(log.date).getTime() === today.getTime()
  );

  if (todayLog) {
    // Toggle completed status
    todayLog.completed = !todayLog.completed;
  } else {
    // Create a new log for today
    habit.logs.push({
      date: today,
      completed: true,
    });
  }

  await habit.save();
  return NextResponse.json(habit);
}
