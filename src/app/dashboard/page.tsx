import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { calculateStreak } from "@/lib/calculateStreak";
import { calculateCompletion } from "@/lib/calculateCompletion";
import { connectToDatabase } from "../lib/mongodb";
import Habit from "../models/Habit";
import HabitForm from "../../components/HabitForm";
import HabitItem from "../../components/HabitItem";



export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

    await connectToDatabase();
    const habits = await Habit.find({ userEmail: session.user.email }).lean();
    const plainHabits = habits.map(habit => {
      const safelogs = habit.logs.map((log: any) => ({
            date: log.date.toISOString(), 
            completed: log.completed,
            note: log.note || "",
            _id: log._id?.toString() || null,
        }));
     const { percentage } = calculateCompletion(safelogs);   
      return {
        ...habit,
        _id: (habit._id as { toString(): string }).toString(),
        logs: safelogs,
        streak: calculateStreak(safelogs),
        completion: percentage,
      }  
});
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        Welcome, {session.user.name} 👋
      </h1>

       <HabitForm />

    {habits.length === 0 ? (
  <p>No habits yet. Start by creating one!</p>
) : (
  <ul className="space-y-2">
    {/* Change type here for habit */}
   {plainHabits.map((habit: any) => (
    <HabitItem key={habit._id} habit={habit} />
    ))}
  </ul>
)}
    </div>
  );
}
