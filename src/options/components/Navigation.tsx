import type { NavigationProps } from '../../types';
import { For } from 'solid-js';

export function Navigation(props: NavigationProps) {
  const tabs = [
    { id: 'snippets', label: '📝 Snippets', icon: '📝' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
    { id: 'import-export', label: '📤 Import/Export', icon: '📤' },
    { id: 'about', label: 'ℹ️ About', icon: 'ℹ️' }
  ];

  return (
    <nav class="bg-white border-b border-gray-200 px-6">
      <div class="flex space-x-1">
        <For each={tabs}>
          {(tab) => (
            <button
              class={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                props.activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => props.onTabChange(tab.id)}
            >
              <span class="mr-2">{tab.icon}</span>
              {tab.label.replace(/^.+ /, '')}
            </button>
          )}
        </For>
      </div>
    </nav>
  );
}
