import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ExternalLink, X } from "lucide-react";

interface TaskCardProps {
  task: {
    id: string;
    command: string;
    status: "pending" | "processing" | "completed" | "failed";
    result?: string;
    url?: string;
    timestamp: Date;
  };
  onCancel?: (id: string) => void;
}

export const TaskCard = ({ task, onCancel }: TaskCardProps) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "processing":
        return <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />;
      case "failed":
        return <X className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case "completed":
        return "success";
      case "processing":
        return "default";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="relative overflow-hidden border-l-4 border-l-primary/20 hover:border-l-primary transition-smooth">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-sm font-medium truncate max-w-xs">
              {task.command}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor() as any} className="text-xs">
              {task.status}
            </Badge>
            {task.status === "processing" && onCancel && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCancel(task.id)}
                className="h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          {task.timestamp.toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      
      {task.result && (
        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-foreground/80 truncate flex-1">
              {task.result}
            </p>
            {task.url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(task.url, "_blank")}
                className="shrink-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};