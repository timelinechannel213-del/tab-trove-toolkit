import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bot, Zap } from "lucide-react";
import { toast } from "sonner";

interface CommandInputProps {
  onExecute: (command: string) => void;
}

export const CommandInput = ({ onExecute }: CommandInputProps) => {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setIsProcessing(true);
    toast.loading("Processing command...", { id: "command" });

    try {
      await onExecute(command.trim());
      setCommand("");
      toast.success("Command executed successfully!", { id: "command" });
    } catch (error) {
      toast.error("Failed to execute command", { id: "command" });
    } finally {
      setIsProcessing(false);
    }
  };

  const suggestions = [
    "do search for React tutorials",
    "do open GitHub in new tab",
    "do find emails from last week",
    "do close all social media tabs"
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 flex items-center gap-2 text-muted-foreground">
            <Bot className="h-4 w-4" />
            <span className="text-sm font-medium">do</span>
          </div>
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Tell me what you want to do..."
            className="pl-16 pr-20 h-14 text-base bg-card border-2 border-border focus:border-primary rounded-xl shadow-elegant"
            disabled={isProcessing}
          />
          <Button
            type="submit"
            variant="chrome"
            size="sm"
            disabled={isProcessing || !command.trim()}
            className="absolute right-2 h-10"
          >
            {isProcessing ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="command"
            size="sm"
            onClick={() => setCommand(suggestion)}
            className="text-xs"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};