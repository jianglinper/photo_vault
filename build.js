const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 支持的图片文件扩展名列表
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];

// 默认随机图片文件夹配置
// 可修改为具体文件夹名称，如 '风景'、'人物' 等，为空则默认选择所有文件夹
const DEFAULT_RANDOM_FOLDER = 'Genshin';

// 判断文件是否为图片文件
function isImageFile(filename) {
    return IMAGE_EXTENSIONS.includes(path.extname(filename).toLowerCase());
}

// 格式化文件大小，自动选择合适的单位（KB/MB/GB）
function formatFileSize(bytes) {
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
async function scanDirectory(rootPath) {
    const items = fs.readdirSync(rootPath);
    const folders = [];
    const rootFiles = [];
    const allImagePaths = [];
    
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
    
    return { folders, rootFiles, allImagePaths };
}

// 生成文件树HTML
function generateTreeHtml(folders, rootFiles) {
    let treeHtml = '';
    
    if (rootFiles.length > 0) {
        rootFiles.forEach(file => {
            const dimensionsHtml = file.dimensions ? ` (${file.dimensions})` : '';
            treeHtml += `                <div class="tree-item file-item" data-path="${file.path}">
                    <span class="tree-icon clickable" onclick="previewLink('${file.path}')">🖼️</span>
                    <span class="tree-name clickable" onclick="previewLink('${file.path}')">${file.name}</span>
                    <span class="file-info">
                        <span class="file-type">${file.ext.substring(1).toUpperCase()}${dimensionsHtml}</span>
                        <span class="file-size">${formatFileSize(file.size)}</span>
                    </span>
                    <button class="copy-btn" onclick="copyLink('${file.path}', this)">📋</button>
                </div>
`;
        });
    }
    
    folders.forEach(folder => {
        treeHtml += `                <div class="tree-item folder-item collapsed">
                    <div class="folder-toggle" onclick="toggleFolder(this)">
                        <span class="toggle-icon">▶</span>
                        <span class="tree-icon">📁</span>
                        <span class="tree-name">${folder.name}</span>
                        <span class="folder-count">(${folder.files.length})</span>
                        <button class="copy-btn copy-folder-btn" onclick="copyFolderName('${folder.name}', this)">📋</button>
                    </div>
                    <div class="folder-content">
`;
        folder.files.forEach(file => {
            const dimensionsHtml = file.dimensions ? ` (${file.dimensions})` : '';
            treeHtml += `                        <div class="tree-item file-item" data-path="${file.path}">
                            <span class="tree-icon clickable" onclick="previewLink('${file.path}')">🖼️</span>
                            <span class="tree-name clickable" onclick="previewLink('${file.path}')">${file.name}</span>
                            <span class="file-info">
                                <span class="file-type">${file.ext.substring(1).toUpperCase()}${dimensionsHtml}</span>
                                <span class="file-size">${formatFileSize(file.size)}</span>
                            </span>
                            <button class="copy-btn" onclick="copyLink('${file.path}', this)">📋</button>
                        </div>
`;
        });
        treeHtml += `                    </div>
                </div>
`;
    });
    
    return treeHtml;
}

// 生成文件夹下拉菜单选项HTML
function generateFolderOptions(folders) {
    let optionsHtml = '<option value="">所有文件夹</option>';
    folders.forEach(folder => {
        const selected = folder.name === DEFAULT_RANDOM_FOLDER ? ' selected' : '';
        optionsHtml += `<option value="${folder.name}"${selected}>${folder.name}</option>`;
    });
    return optionsHtml;
}

// 主函数：扫描目录并生成index.html
async function main() {
    const scriptDir = __dirname;
    const websiteDir = path.join(scriptDir, 'website');
    const templateFile = path.join(scriptDir, 'template.html');
    const outputFile = path.join(scriptDir, 'index.html');
    
    if (!fs.existsSync(websiteDir)) {
        console.error(`错误: website 目录不存在: ${websiteDir}`);
        process.exit(1);
    }
    
    if (!fs.existsSync(templateFile)) {
        console.error(`错误: template.html 文件不存在: ${templateFile}`);
        process.exit(1);
    }
    
    console.log(`扫描目录: ${websiteDir}`);
    const { folders, rootFiles, allImagePaths } = await scanDirectory(websiteDir);
    
    const totalFolders = folders.length;
    const totalFiles = folders.reduce((sum, f) => sum + f.files.length, 0) + rootFiles.length;
    
    console.log(`找到 ${folders.length} 个文件夹`);
    console.log(`找到 ${rootFiles.length} 张根目录图片`);
    console.log(`总计 ${totalFiles} 张图片`);
    
    folders.forEach(folder => {
        console.log(`  - ${folder.name}: ${folder.files.length} 张图片`);
    });
    
    const treeHtml = generateTreeHtml(folders, rootFiles);
    const folderOptions = generateFolderOptions(folders);
    
    let templateContent = fs.readFileSync(templateFile, 'utf-8');
    templateContent = templateContent.replace('{{totalFolders}}', totalFolders);
    templateContent = templateContent.replace('{{totalFiles}}', totalFiles);
    templateContent = templateContent.replace('{{treeContent}}', treeHtml);
    templateContent = templateContent.replace('{{folderOptions}}', folderOptions);
    
    fs.writeFileSync(outputFile, templateContent, 'utf-8');
    
    console.log(`✅ 已生成 index.html 到: ${outputFile}`);
}

main();
