import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Habit from "@/app/models/Habit";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { name } = await req.json();
  await connectToDatabase();

  const habit = await Habit.findById(params.id);
  if (!habit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  habit.name = name;
  await habit.save();

  return NextResponse.json({ success: true });
}