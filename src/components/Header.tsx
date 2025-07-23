import { Button } from "@/components/ui/button";
import { Chrome, Settings, User } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-chrome rounded-lg flex items-center justify-center">
                <Chrome className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-chrome bg-clip-text text-transparent">
                  Tab Trove Toolkit
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI-powered browser automation
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};