import type { NewSnippetModalProps } from '../../types';
import { createSignal } from 'solid-js';

export function NewSnippetModal(props: NewSnippetModalProps) {
  const [shortcut, setShortcut] = createSignal('');
  const [content, setContent] = createSignal('');

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (shortcut().trim() && content().trim()) {
      props.onSave(shortcut().trim(), content().trim());
    }
  }

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={props.onCancel}>
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Create New Snippet</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Shortcut:</label>
              <input
                type="text"
                placeholder="/example"
                value={shortcut()}
                onInput={(e) => setShortcut((e.target as HTMLInputElement).value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                autofocus
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Content:</label>
              <textarea
                placeholder="Enter your snippet content..."
                value={content()}
                onInput={(e) => setContent((e.target as HTMLTextAreaElement).value)}
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          <div class="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={props.onCancel} 
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
