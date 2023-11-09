{
  "manifest_version": 3,
  "name": "AI Quick Fill",
  "description": "This extension autocompletes text in textboxes using LLM models.",
  "version": "0.1.0",
  "permissions": ["activeTab", "storage", "<all_urls>"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "images/icon16.png",
      "48": "images/icon48.png",
      "128": "images/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]
}