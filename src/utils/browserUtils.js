// 浏览器兼容的工具函数

// 格式化文件大小，自动选择合适的单位（KB/MB/GB）
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 从指定路径数组中随机选择一张图片路径
export function getRandomImage(imagePaths) {
    if (!imagePaths || imagePaths.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * imagePaths.length);
    return imagePaths[randomIndex];
}
