import { getRandomImage } from './imageScanner.js';
import fs from 'fs';
import path from 'path';

export default function randomApi() {
  return {
    name: 'random-api',
    configureServer(server) {
      server.middlewares.use('/random', async (req, res, next) => {
        try {
          // 从URL参数获取文件夹名称
          const url = new URL(req.url, `http://${req.headers.host}`);
          const folder = url.searchParams.get('folder');
          
          // 读取图片数据
          const imageDataPath = path.join(process.cwd(), 'src', 'data', 'imageData.js');
          if (!fs.existsSync(imageDataPath)) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: '图片数据未生成' }));
            return;
          }
          
          // 读取并解析图片数据文件
          const imageDataContent = fs.readFileSync(imageDataPath, 'utf8');
          const imageDataMatch = imageDataContent.match(/export const imageData = (.*);/);
          if (!imageDataMatch) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: '图片数据格式错误' }));
            return;
          }
          
          const imageData = JSON.parse(imageDataMatch[1]);
          let randomImagePath = null;
          
          // 根据文件夹参数选择图片
          if (folder && imageData.folderImages[folder]) {
            randomImagePath = getRandomImage(imageData.folderImages[folder]);
          } else {
            randomImagePath = getRandomImage(imageData.allImages);
          }
          
          if (!randomImagePath) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: '没有找到图片' }));
            return;
          }
          
          // 返回302重定向到随机图片
          res.statusCode = 302;
          res.setHeader('Location', `/${randomImagePath}`);
          res.end();
        } catch (error) {
          console.error('随机图片API错误:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: '服务器内部错误' }));
        }
      });
    }
  };
}