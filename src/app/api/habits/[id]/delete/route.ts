import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Habit from "@/app/models/Habit";

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  await Habit.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}