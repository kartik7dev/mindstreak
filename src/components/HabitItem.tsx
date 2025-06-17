"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HabitItem({ habit }: { habit: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayLog = habit.logs.find(
    (log: any) => new Date(log.date).getTime() === today.getTime(

  const isLogged = habit.logs.some((log: any) => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === today.getTime() && log.completed;
  });

  const toggleLog = async () => {
    startTransition(async () => {
      await fetch(`/api/habits/${habit._id}`, {
        method: "PATCH",
      });
      router.refresh();
    });
  };

  return (
    <li className="border p-4 rounded shadow bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{habit.name}</h2>
          <p className="text-sm text-gray-500">
            Logged today: {isLogged ? "✅" : "❌"}
          </p>
        </div>
        <Button
          onClick={toggleLog}
          variant={isLogged ? "secondary" : "default"}
          disabled={isPending}
        >
          {isLogged ? "Undo" : "Mark as Done"}
        </Button>
      </div>
    </li>
  );
}
