
export interface User {
  username: string;
  role: 'admin' | 'user';
}

export enum ToolCategory {
  VIDEO = 'Video',
  IMAGE = 'Image',
  PDF = 'PDF',
  AI = 'AI Assistant',
  SECURITY = 'Security',
  UTILITY = 'Utility',
  SYSTEM = 'System'
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  path: string;
  color: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  toolId: string;
  action: string;
  description: string;
  metadata?: any;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
