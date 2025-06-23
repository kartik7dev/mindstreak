'use client';

import { useState } from "react";

export default function HabitItem({ habit }: { habit: { _id: string, name: string, logs: Array<{ date: string, completed: boolean, note: string }>, streak: number, completion: number } }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editNoteText, setEditNoteText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(habit.name);


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

  const handleSaveEdit = async () => {
    try {
      await fetch(`/api/habits/${habit._id}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedName }),
      });
      location.reload();
    } catch (err) {
      console.error("Error updating habit:", err);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this habit?");
    if (!confirm) return;

    try {
      await fetch(`/api/habits/${habit._id}/delete`, {
        method: "DELETE",
      });
      location.reload();
    } catch (err) {
      console.error("Error deleting habit:", err);
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
            {isEditing ? (
        <>
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSaveEdit}
              className="px-4 py-1 bg-green-600 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-1 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div className="flex gap-4 text-sm mt-2">
          <button
            onClick={() => {
              setEditedName(habit.name);
              setIsEditing(true);
            }}
            className="text-blue-600 hover:underline"
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:underline"
          >
            🗑️ Delete
          </button>
        </div>
      )}

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

    <p className="text-sm mt-2 text-blue-600">
      📈 7-Day Completion: <strong>{habit.completion}%</strong>
    </p>
    <div className="w-full bg-gray-200 h-2 rounded overflow-hidden mt-1">
      <div
        className="h-full bg-blue-500"
        style={{ width: `${habit.completion}%` }}
      ></div>
    </div>

    {habit.completion >= 80 && (
        <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
          ✅ Great Consistency!
        </span>
    )}



    </div>
  );
}