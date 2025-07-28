import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { CommandInput } from "@/components/CommandInput";
import { TaskCard } from "@/components/TaskCard";
import { TabManager } from "@/components/TabManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Zap, Globe, Clock } from "lucide-react";
import { toast } from "sonner";
import { isExtension, sendMessageToBackground, getPageInfo } from "@/utils/extension";
import { PageInfo } from "@/types/extension";

interface Task {
  id: string;
  command: string;
  status: "pending" | "processing" | "completed" | "failed";
  result?: string;
  url?: string;
  timestamp: Date;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPageInfo, setCurrentPageInfo] = useState<PageInfo | null>(null);

  useEffect(() => {
    const init = async () => {
      const pageInfo = await getPageInfo();
      setCurrentPageInfo(pageInfo);
    };
    
    init();
  }, []);

  const executeCommand = async (command: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      command,
      status: "processing",
      timestamp: new Date(),
      url: currentPageInfo?.url
    };

    setTasks(prev => [newTask, ...prev]);

    try {
      // Execute command through extension
      const response = await sendMessageToBackground({
        type: 'EXECUTE_COMMAND',
        payload: { command, pageInfo: currentPageInfo }
      });

      const updatedTask: Task = {
        ...newTask,
        status: response.success ? "completed" : "failed",
        result: response.success ? JSON.stringify(response.result) : "Command failed"
      };

      setTasks(prev => prev.map(task => 
        task.id === newTask.id ? updatedTask : task
      ));
    } catch (error) {
      const updatedTask: Task = {
        ...newTask,
        status: "failed",
        result: "Failed to execute command"
      };

      setTasks(prev => prev.map(task => 
        task.id === newTask.id ? updatedTask : task
      ));
    }
  };

  const generateMockResult = (command: string): string => {
    if (command.includes("search")) {
      return `Found ${Math.floor(Math.random() * 20) + 5} results and opened top 3 in new tabs`;
    } else if (command.includes("close")) {
      return `Closed ${Math.floor(Math.random() * 8) + 1} tabs as requested`;
    } else if (command.includes("open")) {
      return "Successfully opened the requested page in a new tab";
    } else {
      return "Task completed successfully";
    }
  };

  const cancelTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: "failed" as const } : task
    ));
    toast("Task cancelled");
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    processing: tasks.filter(t => t.status === "processing").length,
  };

  return (
    <div className="w-96 h-[600px] bg-gradient-subtle overflow-hidden">
      <Header />
      
      <main className="px-4 py-4 space-y-4 h-full overflow-y-auto">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-4">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold bg-gradient-chrome bg-clip-text text-transparent">
              Tab Trove Toolkit
            </h1>
            <p className="text-sm text-muted-foreground">
              Execute commands on {currentPageInfo?.domain || 'any website'} with natural language
            </p>
            {currentPageInfo && (
              <div className="text-xs text-muted-foreground bg-card rounded-lg p-2 border">
                <p className="font-medium truncate">{currentPageInfo.title}</p>
                <p className="text-xs truncate opacity-75">{currentPageInfo.url}</p>
              </div>
            )}
          </div>
          
          <CommandInput onExecute={executeCommand} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-card rounded-lg p-2 border">
            <div className="text-lg font-bold text-primary">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="bg-card rounded-lg p-2 border">
            <div className="text-lg font-bold text-success">{stats.completed}</div>
            <div className="text-xs text-muted-foreground">Done</div>
          </div>
          <div className="bg-card rounded-lg p-2 border">
            <div className="text-lg font-bold text-warning">{stats.processing}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Commands</h2>
            <Badge variant="secondary" className="text-xs">
              {tasks.length}
            </Badge>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onCancel={cancelTask}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No commands yet</p>
                <p className="text-xs">Try: "scroll to top" or "click first button"</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Index;
