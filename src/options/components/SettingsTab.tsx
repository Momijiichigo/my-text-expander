import type { SettingsTabProps } from '../../types';
import { createSignal } from 'solid-js';

export function SettingsTab(props: SettingsTabProps) {
  const [formData, setFormData] = createSignal({ ...props.settings });

  function handleSubmit(e: Event) {
    e.preventDefault();
    props.onSave(formData());
  }

  function updateSetting(key: string, value: any) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Extension Settings</h2>
      
      <form onSubmit={handleSubmit} class="space-y-8">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Expansion Behavior</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Trigger Key</label>
              <select 
                value={formData().triggerKey || 'space'}
                onChange={(e) => updateSetting('triggerKey', (e.target as HTMLSelectElement).value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="space">Space Bar</option>
                <option value="tab">Tab Key</option>
                <option value="enter">Enter Key</option>
              </select>
            </div>

            <div>
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData().caseSensitive || false}
                  onChange={(e) => updateSetting('caseSensitive', (e.target as HTMLInputElement).checked)}
                  class="rounded border-gray-300"
                />
                <span class="text-sm text-gray-700">Case sensitive shortcuts</span>
              </label>
            </div>

            <div>
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData().showPreview || false}
                  onChange={(e) => updateSetting('showPreview', (e.target as HTMLInputElement).checked)}
                  class="rounded border-gray-300"
                />
                <span class="text-sm text-gray-700">Show preview before expansion</span>
              </label>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Interface</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select 
                value={formData().theme || 'light'}
                onChange={(e) => updateSetting('theme', (e.target as HTMLSelectElement).value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div>
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData().enableSounds || false}
                  onChange={(e) => updateSetting('enableSounds', (e.target as HTMLInputElement).checked)}
                  class="rounded border-gray-300"
                />
                <span class="text-sm text-gray-700">Enable sound notifications</span>
              </label>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Advanced</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Excluded Websites</label>
              <textarea
                value={(formData().excludedSites || []).join('\n')}
                onInput={(e) => updateSetting('excludedSites', 
                  (e.target as HTMLTextAreaElement).value.split('\n').filter(site => site.trim())
                )}
                placeholder="domain1.com&#10;domain2.org"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="mt-1 text-sm text-gray-500">
                Enter one domain per line to exclude from text expansion
              </div>
            </div>

            <div>
              <label class="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData().enableDebugMode || false}
                  onChange={(e) => updateSetting('enableDebugMode', (e.target as HTMLInputElement).checked)}
                  class="rounded border-gray-300"
                />
                <span class="text-sm text-gray-700">Enable debug mode</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button 
            type="submit" 
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
