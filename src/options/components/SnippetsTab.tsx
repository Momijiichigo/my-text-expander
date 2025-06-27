import type { SnippetsTabProps } from '../../types';
import { For, Show } from 'solid-js';
import { SnippetRow } from './SnippetRow';
import { SnippetEditor } from './SnippetEditor';

export function SnippetsTab(props: SnippetsTabProps) {
  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Snippet Management</h2>
        <button 
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          onClick={() => props.onEdit({
            id: '',
            shortcut: '',
            content: '',
            description: '',
            folder: '',
            enabled: true,
            createdAt: Date.now(),
            updatedAt: Date.now()
          })}
        >
          <span>📝</span>
          New Snippet
        </button>
      </div>

      <div class="bg-white rounded-lg border border-gray-200">
        <div class="p-4 border-b border-gray-200">
          <input
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="🔍 Search snippets..."
            value={props.searchQuery}
            onInput={(e) => props.onSearchChange((e.target as HTMLInputElement).value)}
          />
        </div>

        <div class="overflow-hidden">
          <div class="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 border-b border-gray-200">
            <div class="col-span-2">Shortcut</div>
            <div class="col-span-6">Preview</div>
            <div class="col-span-2">Folder</div>
            <div class="col-span-2">Actions</div>
          </div>

          <div class="divide-y divide-gray-200">
            <For each={props.snippets}>
              {(snippet) => (
                <SnippetRow 
                  snippet={snippet}
                  onEdit={props.onEdit}
                  onDelete={props.onDelete}
                />
              )}
            </For>
            
            <Show when={props.snippets.length === 0}>
              <div class="px-4 py-12 text-center text-gray-500">
                No snippets found. Create your first snippet to get started!
              </div>
            </Show>
          </div>
        </div>
      </div>

      <Show when={props.editingSnippet() !== null}>
        <SnippetEditor 
          snippet={props.editingSnippet()!}
          onSave={props.onSave}
          onCancel={() => props.onEdit(null)}
        />
      </Show>
    </div>
  );
}
