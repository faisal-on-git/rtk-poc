const fs = require('fs');
const path = require('path');

const buildPath = path.join(__dirname, '../build/static/js');

try {
  // Remove all source map files
  fs.readdirSync(buildPath).forEach(file => {
    if (file.endsWith('.js.map')) {
      fs.unlinkSync(path.join(buildPath, file));
    }
  });

  // Remove source map references from JS files
  fs.readdirSync(buildPath).forEach(file => {
    if (file.endsWith('.js')) {
      const filePath = path.join(buildPath, file);
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/\/\/# sourceMappingURL=.*$/gm, '');
      fs.writeFileSync(filePath, content);
    }
  });

  console.log('Successfully removed source maps');
} catch (error) {
  console.error('Error removing source maps:', error);
  process.exit(1);
}