"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Circle, Plus, Trash2, ListTodo } from "lucide-react"

type Task = {
  id: string
  text: string
  completed: boolean
}

export function DailyTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskText, setNewTaskText] = useState("")

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("hellobhaiya_daily_tasks")
    if (saved) {
      try {
        setTasks(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse tasks", e)
      }
    } else {
      // Default tasks
      setTasks([
        { id: "1", text: "Complete Physics Module 4", completed: false },
        { id: "2", text: "Review Chemistry Mock Test", completed: true },
        { id: "3", text: "Solve 50 Biology MCQs", completed: false },
      ])
    }
  }, [])

  // Save to local storage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("hellobhaiya_daily_tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const addTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newTaskText.trim()) return
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false
    }
    
    setTasks([...tasks, newTask])
    setNewTaskText("")
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const completedCount = tasks.filter(t => t.completed).length
  const progress = tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100

  return (
    <div className="bg-surface border border-white/5 rounded-[28px] p-6 flex flex-col min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <ListTodo size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Daily Tasks</h3>
            <p className="text-[11px] text-text-secondary">{completedCount} of {tasks.length} completed</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-surface-2 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4 custom-scrollbar pr-2">
        {tasks.length === 0 ? (
          <div className="text-center text-text-secondary text-sm py-8">
            No tasks for today. Add one below!
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className={`group flex items-center justify-between p-3 rounded-2xl transition-all duration-200 border ${
                task.completed 
                  ? "bg-surface-2/50 border-white/5" 
                  : "bg-surface-2 border-white/10 hover:border-white/20"
              }`}
            >
              <div 
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => toggleTask(task.id)}
              >
                {task.completed ? (
                  <CheckCircle2 size={18} className="text-accent flex-shrink-0" />
                ) : (
                  <Circle size={18} className="text-text-secondary flex-shrink-0" />
                )}
                <span className={`text-sm transition-all duration-200 ${
                  task.completed ? "text-text-muted line-through" : "text-white"
                }`}>
                  {task.text}
                </span>
              </div>
              <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-red-400 transition-all p-1"
                aria-label="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={addTask} className="mt-auto relative">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
          className="w-full bg-surface-2 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
        />
        <button 
          type="submit"
          disabled={!newTaskText.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl bg-accent text-black disabled:opacity-50 disabled:bg-surface-2 disabled:text-text-secondary transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </form>
    </div>
  )
}
