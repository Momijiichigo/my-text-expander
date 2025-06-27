import { render } from 'solid-js/web';
import { createSignal, createEffect, For, Show } from 'solid-js';
import type { Snippet, ChromeResponse } from '../types';

// Import components
import { SnippetItem, NewSnippetModal } from './components';

function PopupApp() {
  const [snippets, setSnippets] = createSignal<Snippet[]>([]);
  const [recentSnippets, setRecentSnippets] = createSignal<Snippet[]>([]);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [searchResults, setSearchResults] = createSignal<Snippet[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [showNewSnippet, setShowNewSnippet] = createSignal(false);

  // Load data on mount
  createEffect(async () => {
    await loadSnippets();
    setLoading(false);
  });

  // Search effect
  createEffect(() => {
    const query = searchQuery();
    if (query.trim()) {
      performSearch(query);
    } else {
      setSearchResults([]);
    }
  });

  async function loadSnippets() {
    try {
      console.log('📦 Loading snippets...');
      const response = await chrome.runtime.sendMessage({ 
        type: 'GET_SNIPPETS' 
      }) as ChromeResponse<Record<string, Snippet>>;
      
      if (response && response.success) {
        const snippetsData = response.data || {};
        const allSnippets = Object.entries(snippetsData).map(([key, snippet]) => ({
          ...snippet,
          id: snippet.id || key // Ensure each snippet has an ID
        }));
        
        console.log('📦 Loaded snippets:', allSnippets.length, allSnippets);
        setSnippets(allSnippets);
        
        // Get recent snippets (active ones, sorted by usage or creation time)
        const recent = allSnippets
          .filter(s => s.enabled !== false)
          .sort((a, b) => {
            // Sort by useCount first, then by creation time (most recent first)
            const useCountDiff = (b.useCount || 0) - (a.useCount || 0);
            if (useCountDiff !== 0) return useCountDiff;
            return (b.createdAt || 0) - (a.createdAt || 0);
          })
          .slice(0, 5); // Show top 5 recent snippets
        
        setRecentSnippets(recent);
      } else {
        console.error('Failed to load snippets:', response?.error || 'No response received');
        setSnippets([]);
        setRecentSnippets([]);
      }
    } catch (error) {
      console.error('Failed to load snippets:', error);
      setSnippets([]);
      setRecentSnippets([]);
    }
  }

  async function performSearch(query: string) {
    const allSnippets = snippets();
    const results = allSnippets.filter(snippet => 
      snippet.shortcut.toLowerCase().includes(query.toLowerCase()) ||
      snippet.content.toLowerCase().includes(query.toLowerCase()) ||
      (snippet.description || '').toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  }

  function openOptions() {
    chrome.runtime.openOptionsPage();
    window.close();
  }

  function createQuickSnippet() {
    setShowNewSnippet(true);
  }

  async function saveQuickSnippet(shortcut: string, content: string) {
    try {
      console.log('💾 Saving quick snippet:', { shortcut, content });
      const response = await chrome.runtime.sendMessage({
        type: 'SAVE_SNIPPET',
        snippet: {
          shortcut,
          content,
          folder: 'Quick',
          description: '',
          enabled: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      }) as ChromeResponse;
      
      if (response && response.success) {
        console.log('✅ Quick snippet saved successfully');
        setShowNewSnippet(false);
        await loadSnippets(); // Refresh the snippet list
      } else {
        console.error('Failed to save quick snippet:', response?.error || 'No response received');
        alert('Failed to save snippet. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save snippet:', error);
      alert('Failed to save snippet. Please try again.');
    }
  }

  function truncateText(text: string, maxLength: number = 50): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  return (
    <div class="w-80 bg-white">
      {/* Header */}
      <div class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg">🔥</span>
          <span class="font-semibold text-gray-900">My Text Expander</span>
        </div>
        <button 
          class="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          onClick={openOptions}
          title="Settings"
        >
          ⚙️
        </button>
      </div>

      {/* Quick Actions */}
      <div class="p-4 border-b border-gray-200">
        <button 
          class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          onClick={createQuickSnippet}
        >
          <span>📝</span>
          New Snippet
        </button>
      </div>

      {/* Search */}
      <div class="p-4 border-b border-gray-200">
        <input
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="🔍 Search snippets..."
          value={searchQuery()}
          onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
        />
      </div>

      {/* Content */}
      <div class="max-h-64 overflow-y-auto">
        <Show when={loading()}>
          <div class="p-4 text-center text-gray-500">
            Loading snippets...
          </div>
        </Show>

        <Show when={!loading()}>
          <Show when={searchQuery().trim()}>
            <div class="p-4">
              <h3 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <span>🔍</span>
                Search Results ({searchResults().length})
              </h3>
              <div class="space-y-2">
                <For each={searchResults()}>
                  {(snippet) => <SnippetItem snippet={snippet} />}
                </For>
                <Show when={searchResults().length === 0}>
                  <div class="text-center py-4 text-gray-500 text-sm">
                    No snippets found matching "{searchQuery()}"
                  </div>
                </Show>
              </div>
            </div>
          </Show>

          <Show when={!searchQuery().trim()}>
            <Show when={recentSnippets().length > 0}>
              <div class="p-4">
                <h3 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <span>⭐</span>
                  Recent Snippets
                </h3>
                <div class="space-y-2">
                  <For each={recentSnippets()}>
                    {(snippet) => <SnippetItem snippet={snippet} />}
                  </For>
                </div>
              </div>
            </Show>

            <Show when={recentSnippets().length === 0}>
              <div class="p-6 text-center">
                <div class="text-4xl mb-3">📝</div>
                <div class="text-gray-700 font-medium mb-2">No snippets yet</div>
                <div class="text-gray-500 text-sm mb-4">
                  Create your first snippet to get started!
                </div>
                <button 
                  class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  onClick={openOptions}
                >
                  Open Settings →
                </button>
              </div>
            </Show>
          </Show>
        </Show>
      </div>

      {/* Footer */}
      <div class="border-t border-gray-200 px-4 py-2 bg-gray-50">
        <div class="flex justify-between items-center text-xs text-gray-500">
          <span>{snippets().length} snippets</span>
          <button 
            class="text-blue-600 hover:text-blue-700"
            onClick={openOptions}
          >
            Manage all →
          </button>
        </div>
      </div>

      {/* New Snippet Modal */}
      <Show when={showNewSnippet()}>
        <NewSnippetModal 
          onSave={saveQuickSnippet}
          onCancel={() => setShowNewSnippet(false)}
        />
      </Show>
    </div>
  );
}

// Render the app
const root = document.getElementById('popup-root');
if (root) {
  render(() => <PopupApp />, root);
}
