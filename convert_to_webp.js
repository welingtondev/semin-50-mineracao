import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const directoryPath = path.join(process.cwd(), 'src', 'assets');

const convertAndRemove = async (dir) => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
            const ext = path.extname(file);
            const basename = path.basename(file, ext);
            const webpFilename = `${basename}.webp`;
            const inputPath = path.join(dir, file);
            const outputPath = path.join(dir, webpFilename);

            console.log(`Converting ${file} to ${webpFilename}...`);
            await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);
            
            // Delete original file
            fs.unlinkSync(inputPath);
        }
    }
};

const run = async () => {
    try {
        await convertAndRemove(directoryPath);
        
        const galleryDir = path.join(directoryPath, 'gallery');
        await convertAndRemove(galleryDir);
        
        console.log('Success!');
    } catch (error) {
        console.error('Error:', error);
    }
};

run();
