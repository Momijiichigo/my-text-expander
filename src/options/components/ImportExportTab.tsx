import type { ImportExportTabProps, ExportData } from '../../types';
import { createSignal } from 'solid-js';

export function ImportExportTab(props: ImportExportTabProps) {
  const [importing, setImporting] = createSignal(false);
  const [exporting, setExporting] = createSignal(false);

  async function exportData() {
    setExporting(true);
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_SNIPPETS' });
      if (response && response.success) {
        const data: ExportData = {
          version: '1.0',
          timestamp: Date.now(),
          snippets: response.data
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `text-expander-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        console.error('Export failed:', response?.error || 'No response received');
        alert('Export failed. Please try again.');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  }

  function handleImport(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          setImporting(true);
          const result = e.target?.result as string;
          const data = JSON.parse(result) as ExportData;
          
          // Validate import data
          if (!data.snippets || typeof data.snippets !== 'object') {
            throw new Error('Invalid backup file format');
          }
          
          // Import snippets
          const snippetEntries = Object.entries(data.snippets);
          for (const [key, snippet] of snippetEntries) {
            await chrome.runtime.sendMessage({
              type: 'SAVE_SNIPPET',
              snippet: {
                id: snippet.id || key,
                shortcut: snippet.shortcut,
                content: snippet.content,
                description: snippet.description || '',
                folder: snippet.folder || '',
                enabled: snippet.enabled !== false,
                createdAt: snippet.createdAt || Date.now(),
                updatedAt: Date.now()
              }
            });
          }
          
          await props.onImportComplete();
          alert(`Import completed successfully! Imported ${snippetEntries.length} snippets.`);
        } catch (error) {
          console.error('Import failed:', error);
          alert('Import failed. Please check the file format.');
        } finally {
          setImporting(false);
          input.value = ''; // Reset file input
        }
      };
      reader.readAsText(file);
    }
  }

  return (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Import & Export</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Export Snippets</h3>
          <p class="text-gray-600 mb-4">Download a backup of all your snippets and settings.</p>
          <button 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            onClick={exportData}
            disabled={exporting()}
          >
            <span>📤</span>
            {exporting() ? 'Exporting...' : 'Export Data'}
          </button>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Import Snippets</h3>
          <p class="text-gray-600 mb-4">Restore snippets from a backup file.</p>
          <input 
            type="file" 
            accept=".json"
            onChange={handleImport}
            disabled={importing()}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {importing() && (
            <div class="mt-2 text-sm text-blue-600">Importing...</div>
          )}
        </div>
      </div>
    </div>
  );
}
