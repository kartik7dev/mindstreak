"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2, "Habit name is too short"),
});

export default function HabitForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const onSubmit = async (data: { name: string }) => {
    const res = await fetch("/api/habits", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      reset();
      router.refresh(); // Refresh the dashboard to show new habit
    } else {
      console.error(await res.json());
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Enter habit name" {...register("name")} />
      {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      <Button type="submit" disabled={isSubmitting}>
        Add Habit
      </Button>
    </form>
  );
}
