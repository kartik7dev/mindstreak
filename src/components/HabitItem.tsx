'use client';

import { useState } from "react";

export default function HabitItem({ habit }: { habit: { _id: string, name: string, logs: Array<{ date: string, completed: boolean, note: string }> } }) {
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

  return (
    <div className="border p-4 rounded shadow bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold">{habit.name}</h2>

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
    </div>
  );
}
