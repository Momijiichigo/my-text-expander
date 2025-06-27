import type { SnippetItemProps } from '../../types';

export function SnippetItem(props: SnippetItemProps) {
  function getSnippetIcon(folder?: string) {
    const icons: Record<string, string> = {
      'Email': '📧',
      'Personal': '👤',
      'Work': '💼',
      'Utilities': '🔧',
      'Quick': '⚡'
    };
    return icons[folder || ''] || '📄';
  }

  return (
    <div class="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors cursor-pointer">
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <code class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
              {props.snippet.shortcut}
            </code>
          </div>
          <div class="text-sm text-gray-700 truncate">
            {props.snippet.content.substring(0, 40)}
            {props.snippet.content.length > 40 ? '...' : ''}
          </div>
        </div>
        <div class="flex-shrink-0 ml-2">
          <span class="text-xs text-gray-500 flex items-center gap-1">
            <span>{getSnippetIcon(props.snippet.folder)}</span>
            {props.snippet.folder}
          </span>
        </div>
      </div>
    </div>
  );
}
