import { scanDirectory } from './imageScanner.js';
import fs from 'fs';
import path from 'path';

export default function imageScanner() {
  return {
    name: 'image-scanner',
    async buildStart() {
      // 扫描 public/website 目录
      const websiteDir = path.join(process.cwd(), 'public', 'website');
      if (!fs.existsSync(websiteDir)) {
        console.error(`错误: website 目录不存在: ${websiteDir}`);
        return;
      }

      console.log(`扫描目录: ${websiteDir}`);
      const { folders, rootFiles, allImagePaths, folderImages } = await scanDirectory(websiteDir);

      const totalFolders = folders.length;
      const totalFiles = folders.reduce((sum, f) => sum + f.files.length, 0) + rootFiles.length;

      console.log(`找到 ${folders.length} 个文件夹`);
      console.log(`找到 ${rootFiles.length} 张根目录图片`);
      console.log(`总计 ${totalFiles} 张图片`);

      folders.forEach(folder => {
        console.log(`  - ${folder.name}: ${folder.files.length} 张图片`);
      });

      // 生成图片数据
      const imageData = {
        folders,
        rootFiles,
        allImages: allImagePaths,
        folderImages,
        totalFolders,
        totalFiles
      };

      // 将图片数据写入到临时文件，供前端使用
      const imageDataDir = path.join(process.cwd(), 'src', 'data');
      if (!fs.existsSync(imageDataDir)) {
        fs.mkdirSync(imageDataDir, { recursive: true });
      }

      fs.writeFileSync(
        path.join(imageDataDir, 'imageData.js'),
        `export const imageData = ${JSON.stringify(imageData)};`
      );
    }
  };
}