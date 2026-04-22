import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';

const inputDir = 'public/assets/images';  // 圧縮前の画像フォルダ
const originalCacheDir = '.cache/original_images';  // オリジナル画像のキャッシュフォルダ
const compressedCacheDir = '.cache/images';  // 圧縮済み画像のキャッシュフォルダ
const outputDir = 'dist/assets/images';   // 出力フォルダ

const plugins = [
    imageminMozjpeg({ quality: 85 }),
    imageminPngquant({ quality: [0.9, 0.95] }),
    imageminSvgo()
];

async function optimizeImages() {
    try {
        await fs.ensureDir(originalCacheDir);
        await fs.ensureDir(compressedCacheDir);
        await fs.ensureDir(outputDir);
        await cleanUpCache();
        await processDirectory(inputDir);
        await copyToDist(compressedCacheDir, outputDir);
        console.log('Image optimization completed.');
    } catch (error) {
        console.error('Error optimizing images:', error);
    }
}

async function processDirectory(inputDir) {
    const files = await fs.readdir(inputDir);
    const tasks = files.map(async (file) => {
        const filePath = path.join(inputDir, file);
        const originalCacheFilePath = path.join(originalCacheDir, file);
        const compressedCacheFilePath = path.join(compressedCacheDir, file);
        const stats = await fs.stat(filePath);

        if (stats.isDirectory()) {
            await fs.ensureDir(originalCacheFilePath);
            await fs.ensureDir(compressedCacheFilePath);
            await processDirectory(filePath);
        } else if (isImageFile(file)) {
            await handleImage(filePath, originalCacheFilePath, compressedCacheFilePath);
        }
    });
    await Promise.all(tasks);
}

function isImageFile(file) {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.svg'].includes(ext);
}

async function handleImage(inputFile, originalCacheFile, compressedCacheFile) {
    const inputHash = await getFileHash(inputFile);
    const originalCacheExists = await fs.pathExists(originalCacheFile);
    const originalCacheHash = originalCacheExists ? await getFileHash(originalCacheFile) : '';

    if (!originalCacheExists || inputHash !== originalCacheHash) {
        await fs.copy(inputFile, originalCacheFile);
        await compressImage(inputFile, compressedCacheFile);
    } else {
        console.log(`Skipping ${inputFile}, no changes detected.`);
    }
}

async function compressImage(inputFile, outputFile) {
    try {
        await imagemin([inputFile], {
            destination: path.dirname(outputFile),
            plugins
        });
        console.log(`Optimized ${inputFile} -> ${outputFile}`);
    } catch (error) {
        console.error(`Error optimizing ${inputFile}:`, error);
    }
}

async function getFileHash(filePath) {
    const data = await fs.readFile(filePath);
    return crypto.createHash('md5').update(data).digest('hex');
}

async function copyToDist(srcDir, destDir) {
    const files = await fs.readdir(srcDir);

    for (const file of files) {
        const srcFile = path.join(srcDir, file);
        const destFile = path.join(destDir, file);
        const stat = await fs.stat(srcFile);

        if (stat.isDirectory()) {
            await fs.ensureDir(destFile);
            await copyToDist(srcFile, destFile);  // 再帰呼び出し
        } else {
            await fs.copy(srcFile, destFile);
            await fs.utimes(destFile, stat.atime, stat.mtime);  // 元の更新日時を適用
        }
    }

    console.log('Copied optimized images to dist folder with original timestamps preserved.');
}


async function cleanUpCache() {
    await removeDeletedFiles(originalCacheDir);
    await removeDeletedFiles(compressedCacheDir);
    await removeDeletedFiles(outputDir);
}

async function removeDeletedFiles(cacheDir) {
    const cacheFiles = await fs.readdir(cacheDir);
    for (const file of cacheFiles) {
        const cacheFilePath = path.join(cacheDir, file);
        const originalFilePath = path.join(inputDir, file);
        if (!(await fs.pathExists(originalFilePath))) {
            await fs.remove(cacheFilePath);
            console.log(`Deleted stale cache file: ${cacheFilePath}`);
        }
    }
}

optimizeImages();
