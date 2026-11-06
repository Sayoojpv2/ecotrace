import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');

// Extract nav
const navMatch = indexHtml.match(/<nav class="navbar" id="navbar">[\s\S]*?<\/nav>/);
const nav = navMatch ? navMatch[0] : '';

// Extract footer
const footerMatch = indexHtml.match(/<footer class="footer">[\s\S]*?<\/footer>/);
const footer = footerMatch ? footerMatch[0] : '';

const pages = [
    { file: 'features.html', title: 'Features' },
    { file: 'how-it-works.html', title: 'How it Works' },
    { file: 'signin.html', title: 'Sign In' },
    { file: 'signup.html', title: 'Sign Up' },
    { file: 'demo.html', title: 'Watch Demo' },
    { file: 'pricing.html', title: 'Pricing' },
    { file: 'integrations.html', title: 'Integrations' },
    { file: 'about.html', title: 'About Us' },
    { file: 'careers.html', title: 'Careers' },
    { file: 'contact.html', title: 'Contact' },
    { file: 'privacy.html', title: 'Privacy Policy' },
    { file: 'terms.html', title: 'Terms of Service' },
];

pages.forEach(page => {
    const content = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EcoTrace - ${page.title}</title>
    <!-- Modern Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@300;500;700;800&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="app">
      ${nav}

      <div class="page-header" style="padding-top: 150px; padding-bottom: 100px; text-align: center; min-height: 60vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1 style="font-size: 3.5rem; margin-bottom: 1rem;">${page.title}</h1>
        <p style="color: var(--text-secondary); font-size: 1.2rem; max-width: 600px;">This is the ${page.title} page for EcoTrace. Content coming soon!</p>
        <a href="/" class="btn btn-secondary" style="margin-top: 2rem;">Back to Home</a>
      </div>

      ${footer}
    </div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`;

    fs.writeFileSync(path.join(__dirname, '../', page.file), content);
});

console.log('Successfully generated HTML pages');
