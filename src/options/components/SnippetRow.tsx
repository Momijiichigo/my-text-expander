import type { SnippetRowProps } from '../../types';

export function SnippetRow(props: SnippetRowProps) {
  
  return (
    <div class="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 items-center">
      <div class="col-span-2">
        <code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">{props.snippet.shortcut}</code>
      </div>
      <div class="col-span-6">
        <div class="text-sm text-gray-900 truncate">
          {props.snippet.content.substring(0, 80)}
          {props.snippet.content.length > 80 ? '...' : ''}
        </div>
        {props.snippet.description && (
          <div class="text-xs text-gray-500 mt-1">{props.snippet.description}</div>
        )}
      </div>
      <div class="col-span-2">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {props.snippet.folder || 'Uncategorized'}
        </span>
      </div>
      <div class="col-span-2 flex gap-2">
        <button 
          class="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          onClick={() => {
            console.log('🖱️ Edit button clicked for snippet:', props.snippet.shortcut);
            props.onEdit(props.snippet);
          }}
          title="Edit"
        >
          ✏️
        </button>
        <button 
          class="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          onClick={() => {
            console.log('🗑️ Delete button clicked for snippet:', props.snippet);
            if (!props.snippet.id) {
              console.error('❌ Snippet has no ID:', props.snippet);
              alert('Cannot delete snippet: No ID found');
              return;
            }
            props.onDelete(props.snippet.id);
          }}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
