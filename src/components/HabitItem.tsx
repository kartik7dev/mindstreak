'use client';

import { useState } from "react";

export default function HabitItem({ habit }: { habit: { _id: string, name: string, logs: Array<{ date: string, completed: boolean, note: string }>, streak: number } }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editNoteText, setEditNoteText] = useState("");

  const todayLog = habit.logs.find((log) => {
    const logDate = new Date(log.date);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === today.getTime();
  });

  const isDone = todayLog?.completed ?? false;
  const todayNote = todayLog?.note ?? "";

  const handleMarkDone = async () => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/habits/${habit._id}/log`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      location.reload(); // refresh UI
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEditedNote = async () => {
    setIsSubmitting(true);
    try {
      await fetch(`/api/habits/${habit._id}/note`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: editNoteText }),
      });
      location.reload();
    } catch (err) {
      console.error("Error saving edited note:", err);
    } finally {
      setIsSubmitting(false);
      setIsEditingNote(false);
    }
  };

  function getLastNDays(n = 7) {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(d);
    }
    return dates;
  }


  return (
    <div className="border p-4 rounded shadow bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold">{habit.name}</h2>
      <p className="text-sm text-purple-600 mt-1">
        🔥 Current Streak: <strong>{habit.streak}</strong> day{habit.streak !== 1 && 's'}
      </p>
      {isDone ? (
        <>
          <p className="text-green-600 mt-2">✅ Completed today</p>

          {isEditingNote ? (
            <>
              <textarea
                className="mt-2 p-2 border rounded w-full"
                rows={2}
                value={editNoteText}
                onChange={(e) => setEditNoteText(e.target.value)}
              />
              <button
                onClick={handleSaveEditedNote}
                disabled={isSubmitting}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {isSubmitting ? "Saving..." : "Save Note"}
              </button>
            </>
          ) : (
            <>
              {todayNote && (
                <p className="italic text-sm mt-2 text-gray-600">Note: {todayNote}</p>
              )}
              <button
                onClick={() => {
                  setEditNoteText(todayNote);
                  setIsEditingNote(true);
                }}
                className="mt-1 text-blue-600 hover:underline text-sm"
              >
                ✏️ Edit Note
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <input
            type="text"
            className="mt-2 p-2 border rounded w-full"
            placeholder="Optional note for today..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            onClick={handleMarkDone}
            disabled={isSubmitting}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isSubmitting ? "Submitting..." : "Mark as Done"}
          </button>
        </>
      )}

      <div className="flex items-center gap-2 mt-4">
        {getLastNDays(7).map((day) => {
          const log = habit.logs.find((log) => {
            const logDate = new Date(log.date);
            logDate.setHours(0, 0, 0, 0);
            return logDate.getTime() === day.getTime();
          });

          const isDone = log?.completed;
          const note = log?.note;

          return (
            <div
              key={day.toISOString()}
              className={`w-8 h-8 rounded-full text-sm flex items-center justify-center border
                ${isDone ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}
              `}
              title={note || day.toDateString()}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>

    </div>
  );
}