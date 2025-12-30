import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 支持的图片文件扩展名列表
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];

// 默认随机图片文件夹配置
const DEFAULT_RANDOM_FOLDER = 'Genshin';

// 判断文件是否为图片文件
function isImageFile(filename) {
    return IMAGE_EXTENSIONS.includes(path.extname(filename).toLowerCase());
}

// 格式化文件大小，自动选择合适的单位（KB/MB/GB）
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const KB = 1024;
    const MB = KB * 1024;
    const GB = MB * 1024;
    
    const halfMB = 0.5 * MB;
    const halfGB = 0.5 * GB;
    
    if (bytes >= halfGB) {
        return Math.round((bytes / GB) * 100) / 100 + ' GB';
    } else if (bytes >= halfMB) {
        return Math.round((bytes / MB) * 100) / 100 + ' MB';
    } else {
        return Math.round((bytes / KB) * 100) / 100 + ' KB';
    }
}

// 获取图片尺寸（宽x高）
async function getImageDimensions(filePath) {
    try {
        const metadata = await sharp(filePath).metadata();
        return `${metadata.width}x${metadata.height}`;
    } catch (error) {
        return null;
    }
}

// 扫描目录，获取文件夹、文件和所有图片路径
export async function scanDirectory(rootPath) {
    const items = fs.readdirSync(rootPath);
    const folders = [];
    const rootFiles = [];
    const allImagePaths = [];
    const folderImages = {};
    
    for (const item of items) {
        const itemPath = path.join(rootPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
            const files = fs.readdirSync(itemPath).filter(file => isImageFile(file)).sort();
            if (files.length > 0) {
                const folderFiles = [];
                for (const file of files) {
                    const filePath = path.join(itemPath, file);
                    const fileStat = fs.statSync(filePath);
                    const dimensions = await getImageDimensions(filePath);
                    const relativePath = path.join('website', item, file).replace(/\\/g, '/');
                    folderFiles.push({
                        name: file,
                        path: relativePath,
                        ext: path.extname(file).toLowerCase(),
                        size: fileStat.size,
                        dimensions: dimensions
                    });
                    allImagePaths.push(relativePath);
                }
                folders.push({
                    name: item,
                    files: folderFiles
                });
                folderImages[item] = folderFiles.map(f => f.path);
            }
        } else if (isImageFile(item)) {
            const fileStat = fs.statSync(itemPath);
            const dimensions = await getImageDimensions(itemPath);
            const relativePath = path.join('website', item).replace(/\\/g, '/');
            rootFiles.push({
                name: item,
                path: relativePath,
                ext: path.extname(item).toLowerCase(),
                size: fileStat.size,
                dimensions: dimensions
            });
            allImagePaths.push(relativePath);
        }
    }
    
    folders.sort((a, b) => a.name.localeCompare(b.name));
    
    return { folders, rootFiles, allImagePaths, folderImages };
}

// 从指定图片数组中随机选择一张图片
export function getRandomImage(imageArray) {
    if (!imageArray || imageArray.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    return imageArray[randomIndex];
}