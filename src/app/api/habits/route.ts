import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongodb";
import Habit from "../../models/Habit";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const habits = await Habit.find({ userEmail: session.user.email });
  return NextResponse.json(habits);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Habit name too short" }, { status: 400 });
  }

  await connectToDatabase();
  const newHabit = await Habit.create({
    userEmail: session.user.email,
    name,
    logs: []
  });

  return NextResponse.json(newHabit);
}
