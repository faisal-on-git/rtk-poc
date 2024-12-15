const fs = require('fs');
require('dotenv').config();
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

const buildPath = path.join(__dirname, '../build/static/js');

async function uploadSourceMap(sourceMapPath, fileName) {
  const formData = new FormData();
  const jsFileName = fileName.replace('.map', '');
  
  formData.append('file', fs.createReadStream(sourceMapPath));
  formData.append('name', fileName);
  // This pattern will match the exact file name in production
  formData.append('pattern', `%/${jsFileName}`);

  try {
    const response = await fetch(
      `https://api.airbrake.io/api/v4/projects/${process.env.REACT_APP_AIRBRAKE_ID}/sourcemaps`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_AIRBRAKE_KEY}`,
        },
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${await response.text()}`);
    }

    console.log(`Successfully uploaded source map for ${jsFileName}`);
    
    // Log the mapping for verification
    console.log(`Mapped: ${jsFileName} -> ${fileName}`);
  } catch (error) {
    console.error(`Failed to upload ${fileName}:`, error);
    throw error;
  }
}

async function uploadAllSourceMaps() {
  try {
    const files = fs.readdirSync(buildPath);
    
    // Find all source map files
    const sourceMapFiles = files.filter(file => file.endsWith('.js.map'));
    
    console.log('Found source maps:', sourceMapFiles);

    for (const file of sourceMapFiles) {
      await uploadSourceMap(path.join(buildPath, file), file);
    }
  } catch (error) {
    console.error('Error in source map upload process:', error);
    process.exit(1);
  }
}

uploadAllSourceMaps();