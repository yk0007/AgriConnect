
import { Calendar, CheckCircle2, CircleDashed } from "lucide-react";

const TasksCard = () => {
  // Mock data - in a real app, this would come from the database
  const tasks = [
    {
      id: 1,
      title: "Apply nitrogen fertilizer",
      dueDate: "Today",
      completed: false,
      priority: "high"
    },
    {
      id: 2,
      title: "Irrigation maintenance",
      dueDate: "Tomorrow",
      completed: false,
      priority: "medium"
    },
    {
      id: 3,
      title: "Harvest wheat field 2",
      dueDate: "In 3 days",
      completed: false,
      priority: "high"
    },
    {
      id: 4,
      title: "Check pest traps",
      dueDate: "Yesterday",
      completed: true,
      priority: "medium"
    }
  ];
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="agri-dash-card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">Tasks</h3>
        <button className="text-xs text-primary hover:underline">View All</button>
      </div>
      
      <div className="space-y-3 flex-1">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`flex items-start p-3 rounded-md border ${
              task.completed ? "border-border/50 bg-muted/50" : "border-border bg-card"
            }`}
          >
            <button className="mr-3 mt-0.5">
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <CircleDashed className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            
            <div className="flex-1">
              <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </p>
              
              <div className="flex items-center mt-1">
                <Calendar className="h-3 w-3 text-muted-foreground mr-1" />
                <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-border">
        <button className="w-full py-2 px-4 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors text-sm font-medium">
          + Add New Task
        </button>
      </div>
    </div>
  );
};

export default TasksCard;
