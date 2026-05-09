"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Plus, Trash2, ListTodo, Loader2 } from "lucide-react"
import { useDailyTasks } from "@/lib/hooks/useDailyTasks"

export function DailyTasks() {
  const { tasks, loading, addTask, toggleTask, deleteTask } = useDailyTasks()
  const [newTaskText, setNewTaskText] = useState("")
  const [adding, setAdding] = useState(false)

  const handleAdd = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newTaskText.trim() || adding) return
    setAdding(true)
    try {
      await addTask(newTaskText)
      setNewTaskText("")
    } finally {
      setAdding(false)
    }
  }

  const completedCount = tasks.filter((t) => t.completed).length
  const progress = tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100

  return (
    <div className="bg-surface border border-white/5 rounded-[28px] p-6 flex flex-col min-h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <ListTodo size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Daily Tasks</h3>
            {loading ? (
              <p className="text-[11px] text-text-secondary">Loading...</p>
            ) : (
              <p className="text-[11px] text-text-secondary">
                {completedCount} of {tasks.length} done today
              </p>
            )}
          </div>
        </div>
        {/* Day indicator */}
        <span className="text-[10px] font-medium text-text-muted bg-surface-2 border border-white/5 px-2.5 py-1 rounded-full">
          {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-surface-2 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1">
        {loading ? (
          <div className="flex items-center justify-center h-20 text-text-muted">
            <Loader2 size={18} className="animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-text-secondary text-sm py-10">
            <p className="mb-1">No tasks yet today.</p>
            <p className="text-text-muted text-xs">Add one below ↓</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-center justify-between p-3 rounded-2xl transition-all duration-200 border ${
                task.completed
                  ? "bg-surface-2/40 border-white/5"
                  : "bg-surface-2 border-white/10 hover:border-white/20"
              }`}
            >
              <div
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => toggleTask(task.id, task.completed)}
              >
                {task.completed ? (
                  <CheckCircle2 size={18} className="text-accent flex-shrink-0" />
                ) : (
                  <Circle size={18} className="text-text-secondary flex-shrink-0" />
                )}
                <span
                  className={`text-sm transition-all duration-200 ${
                    task.completed ? "text-text-muted line-through" : "text-white"
                  }`}
                >
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-red-400 transition-all p-1 rounded-lg"
                aria-label="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Task Input */}
      <form onSubmit={handleAdd} className="mt-auto relative">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a task..."
          maxLength={120}
          className="w-full bg-surface-2 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
        />
        <button
          type="submit"
          disabled={!newTaskText.trim() || adding}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl bg-accent text-black disabled:opacity-40 disabled:bg-surface-2 disabled:text-text-secondary transition-colors"
        >
          {adding ? (
            <Loader2 size={14} className="animate-spin text-black" />
          ) : (
            <Plus size={16} strokeWidth={2.5} />
          )}
        </button>
      </form>
    </div>
  )
}
