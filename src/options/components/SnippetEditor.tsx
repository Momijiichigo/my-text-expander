import type { SnippetEditorProps } from '../../types';
import { createSignal } from 'solid-js';

export function SnippetEditor(props: SnippetEditorProps) {
  const [formData, setFormData] = createSignal({
    shortcut: props.snippet.shortcut || '',
    content: props.snippet.content || '',
    folder: props.snippet.folder || '',
    description: props.snippet.description || ''
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    const data = formData();
    
    if (data.shortcut.trim() && data.content.trim()) {
      props.onSave({
        ...props.snippet,
        ...data,
        shortcut: data.shortcut.trim(),
        content: data.content.trim(),
        folder: data.folder.trim() || 'Uncategorized',
        description: data.description.trim()
      });
    }
  }

  function updateField(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} class="p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6">
            {props.snippet.shortcut ? 'Edit Snippet' : 'Create New Snippet'}
          </h3>
          
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Shortcut *</label>
              <input
                type="text"
                value={formData().shortcut}
                onInput={(e) => updateField('shortcut', (e.target as HTMLInputElement).value)}
                placeholder="/example"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Folder</label>
              <input
                type="text"
                value={formData().folder}
                onInput={(e) => updateField('folder', (e.target as HTMLInputElement).value)}
                placeholder="Personal, Work, etc."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              value={formData().description}
              onInput={(e) => updateField('description', (e.target as HTMLInputElement).value)}
              placeholder="Brief description of this snippet"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Content *</label>
            <textarea
              value={formData().content}
              onInput={(e) => updateField('content', (e.target as HTMLTextAreaElement).value)}
              placeholder="Enter your snippet content here..."
              rows="8"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <div class="mt-2 text-sm text-gray-500">
              You can use dynamic variables like {'{time: YYYY-MM-DD}'} for current date
            </div>
          </div>
          
          <div class="flex justify-end gap-3">
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
              {props.snippet.shortcut ? 'Update' : 'Create'} Snippet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
