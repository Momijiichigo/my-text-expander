export function AboutTab() {
  return (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">About My Text Expander</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Version</h3>
          <p class="text-gray-600">1.0.0</p>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Privacy</h3>
          <p class="text-gray-600 text-sm">
            Your snippets are stored locally in your browser and synced across your 
            Chrome instances. No data is sent to external servers.
          </p>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Description</h3>
        <p class="text-gray-600 mb-4">
          My Text Expander is a personal text expansion tool that helps you save time 
          by creating shortcuts for frequently used text. Type a shortcut and watch 
          it expand into full text instantly.
        </p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Features</h3>
        <ul class="text-gray-600 space-y-2">
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span>
            Custom text shortcuts
          </li>
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span>
            Dynamic variables (dates, user input)
          </li>
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span>
            Works across all websites
          </li>
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span>
            Folder organization
          </li>
          <li class="flex items-center gap-2">
            <span class="text-green-500">✓</span>
            Import/export functionality
          </li>
        </ul>
      </div>
    </div>
  );
}
