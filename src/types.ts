// Shared types for the Chrome extension
export interface Snippet {
  id: string;
  shortcut: string;
  content: string;
  description?: string;
  folder?: string;
  enabled?: boolean;
  createdAt?: number;
  updatedAt?: number;
  useCount?: number;
}

export interface Settings {
  triggerKey?: 'space' | 'tab' | 'enter';
  caseSensitive?: boolean;
  showPreview?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  enableSounds?: boolean;
  excludedSites?: string[];
  enableDebugMode?: boolean;
}

export interface ChromeResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ExportData {
  version: string;
  timestamp: number;
  snippets: Record<string, Snippet>;
}

// Component prop types
export interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface SnippetsTabProps {
  snippets: Snippet[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  editingSnippet: () => Snippet | null;
  onEdit: (snippet: Snippet | null) => void;
  onSave: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
}

export interface SnippetRowProps {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
}

export interface SnippetEditorProps {
  snippet: Snippet;
  onSave: (snippet: Snippet) => void;
  onCancel: () => void;
}

export interface SettingsTabProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export interface ImportExportTabProps {
  onImportComplete: () => Promise<void>;
}

export interface SnippetItemProps {
  snippet: Snippet;
}

export interface NewSnippetModalProps {
  onSave: (shortcut: string, content: string) => void;
  onCancel: () => void;
}
