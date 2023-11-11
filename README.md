# AI Quick Fill
AI Quick Fill is a Chrome extension that provides AI-powered autocompletions for text fields on web pages. It uses GPT-4-turbo to suggest relevant completions as you type.

## Features
+ Get AI-generated suggestions as you type in text fields on any web page;
+ Completions are tailored to the content of each page;
+ Easy to invoke suggestions with a keyboard shortcut;
+ Customize temperature setting to control creativity vs. relevance;
+ Open source project built with JavaScript.

## Usage
After installing the extension:
+ Navigate to any web page with text fields, like a blog editor, email, etc;
+ Start typing text normally in a supported text field;
+ Press space to invoke autocomplete suggestions;
+ Press Tab to accept the highlighted suggestion or Esc to dismiss the suggestions;.

The extension will pass your text, plus the content of the web page, to the AI to generate relevant completions on the fly.

## Installation

You can build the extension from source:

+ Clone this GitHub repository or download the extension from https://github.com/bakaburg1/AiQuickFill/releases;
+ Go to chrome://extensions in Chrome;
+ Enable "Developer mode";
+ Click "Load unpacked" and select the repository folder.

## Configuration
After installing, push on the extension icon to fire the setting popup and set your OpenAI API key.

You can also tweak the Temperature setting, which controls the creativity vs. relevance of suggestions.

## Data protection
Keep in mind that the page content and your inputs are sent to the OpenAI API for suggestions.

Open AI does not store any of this data, but it is your responsibility to ensure that their data policies and terms of service (https://openai.com/enterprise-privacy) are ok with you.

## Contributing
Contributions are welcome! Open issues or propose pull requests.