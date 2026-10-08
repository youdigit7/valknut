const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'src'), function(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Tailwind classes
  content = content.replace(/bg-\[\#0A0A0A\]/gi, 'bg-[var(--bg-main)]');
  content = content.replace(/bg-black(?!\/)/gi, 'bg-[var(--bg-main)]');
  content = content.replace(/bg-\[\#0e1017\]/gi, 'bg-[var(--bg-surface)]');
  content = content.replace(/bg-\[\#0A0C10\]/gi, 'bg-[var(--bg-surface)]');
  content = content.replace(/bg-\[\#12141E\]/gi, 'bg-[var(--bg-card)]');
  content = content.replace(/bg-\[\#08090C\]/gi, 'bg-[var(--bg-main)]');
  
  content = content.replace(/text-white(?!\/)/gi, 'text-[var(--text-primary)]');
  content = content.replace(/text-\[\#ffffff\]/gi, 'text-[var(--text-primary)]');
  content = content.replace(/text-\[\#f8fafc\]/gi, 'text-[var(--text-primary)]');
  content = content.replace(/text-\[\#94a3b8\]/gi, 'text-[var(--text-secondary)]');
  
  // Replace inline sx colors for MUI
  content = content.replace(/bgcolor:\s*['"]#0A0A0A['"]/gi, "bgcolor: 'var(--bg-main)'");
  content = content.replace(/bgcolor:\s*['"]#0e1017['"]/gi, "bgcolor: 'var(--bg-surface)'");
  content = content.replace(/bgcolor:\s*['"]#08090C['"]/gi, "bgcolor: 'var(--bg-main)'");
  content = content.replace(/bgcolor:\s*['"]#10121d['"]/gi, "bgcolor: 'var(--bg-surface)'");
  
  // Text colors in MUI sx
  content = content.replace(/color:\s*['"]white['"]/gi, "color: 'var(--text-primary)'");
  content = content.replace(/color:\s*['"]#ffffff['"]/gi, "color: 'var(--text-primary)'");
  
  // Avoid replacing context text.primary or text.secondary which use MUI theme standard if we already removed ThemeProviders, but to be safe:
  content = content.replace(/color:\s*['"]text\.primary['"]/g, "color: 'var(--text-primary)'");
  content = content.replace(/color:\s*['"]text\.secondary['"]/g, "color: 'var(--text-secondary)'");
  
  content = content.replace(/bgcolor:\s*['"]background\.default['"]/g, "bgcolor: 'var(--bg-main)'");
  content = content.replace(/bgcolor:\s*['"]background\.paper['"]/g, "bgcolor: 'var(--bg-surface)'");

  fs.writeFileSync(filePath, content, 'utf8');
});
