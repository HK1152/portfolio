const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'frontend', 'src', 'assets', 'projects');

async function processImages() {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
  
  for (const file of files) {
    const inputPath = path.join(dir, file);
    const outputPath = path.join(dir, file.replace('.png', '.webp'));
    
    console.log(`Processing ${file}...`);
    await sharp(inputPath)
      .resize({ width: 1200, withoutEnlargement: true }) // reasonable max width for projects
      .webp({ quality: 80 })
      .toFile(outputPath);
      
    // Delete original
    fs.unlinkSync(inputPath);
    console.log(`Saved ${outputPath} and deleted original.`);
  }
}

processImages().catch(console.error);
