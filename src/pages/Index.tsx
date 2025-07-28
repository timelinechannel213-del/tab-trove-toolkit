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
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      command: "do search for React tutorials",
      status: "completed",
      result: "Found 15 React tutorials and opened top 3 in new tabs",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "2", 
      command: "do close all social media tabs",
      status: "completed",
      result: "Closed 4 social media tabs (Facebook, Twitter, Instagram, LinkedIn)",
      timestamp: new Date(Date.now() - 600000),
    },
  ]);
  const [currentPageInfo, setCurrentPageInfo] = useState<PageInfo | null>(null);
  const [isExtensionMode, setIsExtensionMode] = useState(false);

  useEffect(() => {
    const checkExtensionMode = async () => {
      const extensionMode = isExtension();
      setIsExtensionMode(extensionMode);
      
      if (extensionMode) {
        const pageInfo = await getPageInfo();
        setCurrentPageInfo(pageInfo);
      }
    };
    
    checkExtensionMode();
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
      if (isExtensionMode) {
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
      } else {
        // Simulate AI processing for web app mode
        await new Promise(resolve => setTimeout(resolve, 2000));

        const updatedTask: Task = {
          ...newTask,
          status: Math.random() > 0.2 ? "completed" : "failed",
          result: generateMockResult(command),
        };

        setTasks(prev => prev.map(task => 
          task.id === newTask.id ? updatedTask : task
        ));
      }
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
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-chrome bg-clip-text text-transparent">
              {isExtensionMode ? "Tab Trove Toolkit" : "Just type \"do\" and we'll handle the rest!"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isExtensionMode 
                ? `Execute commands on ${currentPageInfo?.domain || 'any website'} with natural language`
                : "Your AI browser assistant that understands natural language and takes actions on your behalf"
              }
            </p>
            {isExtensionMode && currentPageInfo && (
              <div className="text-sm text-muted-foreground bg-card rounded-lg p-3 max-w-md mx-auto border">
                <p className="font-medium">Current page:</p>
                <p className="truncate">{currentPageInfo.title}</p>
                <p className="text-xs truncate">{currentPageInfo.url}</p>
              </div>
            )}
          </div>
          
          <CommandInput onExecute={executeCommand} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-primary">{stats.total}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <Bot className="h-4 w-4" />
                Total Commands
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-success">{stats.completed}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <Zap className="h-4 w-4" />
                Completed
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-warning">{stats.processing}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                Processing
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Recent Tasks</h2>
              <Badge variant="secondary" className="text-xs">
                {tasks.length} tasks
              </Badge>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onCancel={cancelTask}
                  />
                ))
              ) : (
                <Card className="text-center py-8">
                  <CardContent>
                    <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No tasks yet. Try giving me a command!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Tab Manager */}
          {!isExtensionMode && (
            <div className="space-y-4">
              <TabManager />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
