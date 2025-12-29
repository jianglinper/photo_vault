const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const sharp = require('sharp');

// 开发服务器端口号
const PORT = 3000;

// 支持的图片文件扩展名列表
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];

// 判断文件是否为图片文件
function isImageFile(filename) {
    return IMAGE_EXTENSIONS.includes(path.extname(filename).toLowerCase());
}

// 获取所有图片路径（递归扫描所有文件夹）
function getAllImagePaths(websiteDir) {
    const imagePaths = [];
    
    function scanDirectory(dir, relativePath = '') {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                scanDirectory(itemPath, path.join(relativePath, item));
            } else if (isImageFile(item)) {
                const fullPath = path.join('website', relativePath, item).replace(/\\/g, '/');
                imagePaths.push(fullPath);
            }
        }
    }
    
    if (fs.existsSync(websiteDir)) {
        scanDirectory(websiteDir);
    }
    
    return imagePaths;
}

// 获取指定文件夹中的所有图片路径
function getFolderImagePaths(websiteDir, folderName) {
    const imagePaths = [];
    const folderPath = path.join(websiteDir, folderName);
    
    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
        return imagePaths;
    }
    
    const items = fs.readdirSync(folderPath);
    
    for (const item of items) {
        const itemPath = path.join(folderPath, item);
        const stat = fs.statSync(itemPath);
        
        if (!stat.isDirectory() && isImageFile(item)) {
            const fullPath = path.join('website', folderName, item).replace(/\\/g, '/');
            imagePaths.push(fullPath);
        }
    }
    
    return imagePaths;
}

// MIME类型映射表
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
};

// 根据文件扩展名获取MIME类型
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
}

// 提供静态文件服务
function serveFile(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.html') {
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>404 - 文件未找到</h1>');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content);
        });
    } else {
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>404 - 文件未找到</h1>');
                return;
            }
            res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
            res.end(content);
        });
    }
}

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    // 处理随机图片API请求
    if (url.pathname === '/random') {
        const websiteDir = path.join(__dirname, 'website');
        const folderParam = url.searchParams.get('folder');
        let imagePaths = [];
        
        // 根据folder参数决定获取所有图片还是指定文件夹的图片
        if (folderParam) {
            imagePaths = getFolderImagePaths(websiteDir, folderParam);
        } else {
            imagePaths = getAllImagePaths(websiteDir);
        }
        
        // 如果没有找到图片，返回404错误
        if (imagePaths.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: folderParam ? '文件夹中没有找到图片' : '没有找到图片' }));
            return;
        }
        
        // 随机选择一张图片
        const randomPath = imagePaths[Math.floor(Math.random() * imagePaths.length)];
        const filePath = path.join(__dirname, randomPath);
        
        // 读取并返回图片
        if (fs.existsSync(filePath)) {
            const mimeType = getMimeType(filePath);
            fs.readFile(filePath, (err, content) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: '图片读取失败' }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': mimeType });
                res.end(content);
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: '图片不存在' }));
        }
        return;
    }
    
    // 处理静态文件请求
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    // 如果是目录，则查找index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }
    
    // 提供文件服务
    if (fs.existsSync(filePath)) {
        serveFile(res, filePath);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - 文件未找到</h1>');
    }
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`\n🚀 开发服务器已启动`);
    console.log(`📝 访问地址: http://localhost:${PORT}`);
    console.log(`\n按 Ctrl+C 停止服务器\n`);
  
});
