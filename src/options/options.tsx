import { render } from 'solid-js/web';
import { createSignal, createMemo, Show, onMount } from 'solid-js';
import type { Snippet, Settings, ChromeResponse } from '../types';

// Import components
import { 
  Header, 
  Navigation, 
  SnippetsTab, 
  SettingsTab, 
  ImportExportTab, 
  AboutTab 
} from './components';

function OptionsApp() {
  const [activeTab, setActiveTab] = createSignal('snippets');
  const [snippets, setSnippets] = createSignal<Snippet[]>([]);
  const [settings, setSettings] = createSignal<Settings>({});
  const [loading, setLoading] = createSignal(true);
  const [editingSnippet, setEditingSnippet] = createSignal<Snippet | null>(null);
  const [searchQuery, setSearchQuery] = createSignal('');

  onMount(async () => {
    await loadData();
    setLoading(false);
  });

  async function loadData() {
    try {
      const [snippetsResponse, settingsResponse] = await Promise.all([
        chrome.runtime.sendMessage({ type: 'GET_SNIPPETS' }) as Promise<ChromeResponse<Record<string, Snippet>>>,
        chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }) as Promise<ChromeResponse<Settings>>
      ]);

      if (snippetsResponse && snippetsResponse.success) {
        const snippetsData = snippetsResponse.data || {};
        const snippetsList = Object.entries(snippetsData).map(([key, snippet]) => ({
          ...snippet,
          id: snippet.id || key // Ensure each snippet has an ID (use storage key as fallback)
        }));
        setSnippets(snippetsList);
        console.log('📦 Loaded snippets:', snippetsList.length, snippetsList);
      } else {
        console.error('Failed to load snippets:', snippetsResponse?.error || 'No response received');
        setSnippets([]);
      }

      if (settingsResponse && settingsResponse.success) {
        setSettings(settingsResponse.data || {});
      } else {
        console.error('Failed to load settings:', settingsResponse?.error || 'No response received');
        setSettings({});
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      // Set default empty states
      setSnippets([]);
      setSettings({});
    }
  }

  async function saveSnippet(snippet: Snippet) {
    try {
      console.log('💾 Saving snippet:', snippet);
      const response = await chrome.runtime.sendMessage({
        type: 'SAVE_SNIPPET',
        snippet
      }) as ChromeResponse;

      if (response && response.success) {
        console.log('✅ Snippet saved successfully');
        setEditingSnippet(null); // Close the editor
        await loadData(); // Refresh the snippet list
      } else {
        console.error('Failed to save snippet:', response?.error || 'No response received');
        alert('Failed to save snippet. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save snippet:', error);
      alert('Failed to save snippet. Please try again.');
    }
  }

  async function deleteSnippet(id: string) {
    if (confirm('Are you sure you want to delete this snippet?')) {
      try {
        console.log('🗑️ Deleting snippet with ID:', id);
        const response = await chrome.runtime.sendMessage({ 
          type: 'DELETE_SNIPPET', 
          id 
        }) as ChromeResponse;
        
        if (response && response.success) {
          console.log('✅ Snippet deleted successfully');
          await loadData(); // Refresh the snippet list
        } else {
          console.error('Failed to delete snippet:', response?.error || 'No response received');
          alert('Failed to delete snippet. Please try again.');
        }
      } catch (error) {
        console.error('Failed to delete snippet:', error);
        alert('Failed to delete snippet. Please try again.');
      }
    }
  }

  async function saveSettings(newSettings: Settings) {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'SAVE_SETTINGS',
        settings: newSettings
      }) as ChromeResponse;
      
      if (response && response.success) {
        setSettings(newSettings);
      } else {
        console.error('Failed to save settings:', response?.error || 'No response received');
        alert('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  }

  const filteredSnippets = createMemo(() => {
    const query = searchQuery().toLowerCase();
    if (!query) return snippets();
    
    return snippets().filter(snippet => 
      snippet.shortcut.toLowerCase().includes(query) ||
      snippet.content.toLowerCase().includes(query) ||
      (snippet.description || '').toLowerCase().includes(query)
    );
  });


  return (
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Navigation activeTab={activeTab()} onTabChange={setActiveTab} />
      
      <main class="flex-1 p-6">
        <Show when={loading()}>
          <div class="flex items-center justify-center h-64">
            <div class="text-lg text-gray-600">Loading...</div>
          </div>
        </Show>

        <Show when={!loading()}>
          <Show when={activeTab() === 'snippets'}>
            <SnippetsTab 
              snippets={filteredSnippets()}
              searchQuery={searchQuery()}
              onSearchChange={setSearchQuery}
              editingSnippet={editingSnippet}
              onEdit={setEditingSnippet}
              onSave={saveSnippet}
              onDelete={deleteSnippet}
            />
          </Show>

          <Show when={activeTab() === 'settings'}>
            <SettingsTab 
              settings={settings()}
              onSave={saveSettings}
            />
          </Show>

          <Show when={activeTab() === 'import-export'}>
            <ImportExportTab 
              onImportComplete={loadData}
            />
          </Show>

          <Show when={activeTab() === 'about'}>
            <AboutTab />
          </Show>
        </Show>
      </main>
    </div>
  );
}

// Render the app
const root = document.getElementById('options-root');
if (root) {
  render(() => <OptionsApp />, root);
}
