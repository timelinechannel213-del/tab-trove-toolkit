export interface ExtensionMessage {
  type: string;
  payload?: any;
}

export interface CommandExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
}

export interface PageInfo {
  url: string;
  title: string;
  id?: number;
  domain?: string;
}

export interface ExtensionCommand {
  id: string;
  command: string;
  pageInfo: PageInfo;
  timestamp: string;
  status: 'processing' | 'completed' | 'failed';
  result?: any;
}
