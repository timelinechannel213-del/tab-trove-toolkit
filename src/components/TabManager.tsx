import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, X, Plus, Search, History } from "lucide-react";
import { toast } from "sonner";

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  active: boolean;
}

export const TabManager = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "1", title: "Tab Trove Toolkit", url: "https://localhost:8080", active: true },
    { id: "2", title: "Google", url: "https://google.com", active: false },
    { id: "3", title: "GitHub", url: "https://github.com", active: false },
  ]);

  const [history, setHistory] = useState([
    { url: "https://dobrowser.io", title: "Do Browser - AI Web Agent", time: "2 minutes ago" },
    { url: "https://github.com", title: "GitHub", time: "5 minutes ago" },
    { url: "https://google.com", title: "Google", time: "10 minutes ago" },
  ]);

  const closeTab = (id: string) => {
    setTabs(tabs.filter(tab => tab.id !== id));
    toast("Tab closed");
  };

  const switchTab = (id: string) => {
    setTabs(tabs.map(tab => ({ ...tab, active: tab.id === id })));
    toast("Switched tab");
  };

  const openNewTab = (url?: string) => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: url ? "Loading..." : "New Tab",
      url: url || "about:blank",
      active: true
    };
    setTabs([...tabs.map(tab => ({ ...tab, active: false })), newTab]);
    toast("New tab opened");
  };

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="tabs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tabs" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Open Tabs ({tabs.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Recent History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tabs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Browser Tabs</h3>
            <Button onClick={() => openNewTab()} variant="chrome" size="sm">
              <Plus className="h-4 w-4" />
              New Tab
            </Button>
          </div>

          <div className="grid gap-3">
            {tabs.map((tab) => (
              <Card 
                key={tab.id} 
                className={`cursor-pointer transition-all duration-300 ease-smooth hover:shadow-chrome ${
                  tab.active ? "ring-2 ring-primary bg-primary/5" : ""
                }`}
                onClick={() => switchTab(tab.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm font-medium truncate">
                          {tab.title}
                        </CardTitle>
                        <CardDescription className="text-xs truncate">
                          {tab.url}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {tab.active && (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(tab.id);
                        }}
                        className="h-6 w-6"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <h3 className="text-lg font-semibold">Recent History</h3>
          <div className="grid gap-3">
            {history.map((item, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-chrome transition-all duration-300 ease-smooth">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.url}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};