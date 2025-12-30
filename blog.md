# 📸 Photo Vault：我的图片资源库管理系统

## 前言

作为一名开发者，我经常需要管理和浏览大量的图片资源。无论是项目素材、设计灵感，还是个人收藏，一个高效的图片管理系统都是必不可少的。于是，我开发了 **Photo Vault** —— 一个基于 Vue 3 的图片资源库管理系统。

## 什么是 Photo Vault？

Photo Vault 是一个轻量级但功能强大的图片资源库管理系统，它可以帮助你：
- 📁 以树形结构浏览所有图片文件
- 🔍 快速搜索和定位图片
- 🎲 随机浏览图片库
- 🖼️ 便捷地预览和分享图片

## 核心功能

### 1. 智能搜索

搜索功能是 Photo Vault 的核心特性之一。只需在搜索框中输入文件名关键词，系统就会实时过滤并显示匹配的图片。

**技术亮点：**
- 使用 Vue 3 的计算属性（Computed Properties）实现高效的响应式搜索
- 精确匹配算法，避免误匹配（例如搜索"12"不会显示"1.jpg"）
- 自动展开包含匹配文件的文件夹

### 2. 文件树浏览

以树形结构展示所有图片文件，让你可以清晰地看到文件的组织结构。

**功能特性：**
- 点击文件夹展开/折叠
- 显示文件类型、尺寸和大小信息
- 支持复制文件链接和文件夹名称
- 悬停高亮效果，提升交互体验

### 3. 随机图片展示

随机展示图片库中的图片，让你发现那些可能被遗忘的宝藏。

**实现原理：**
- 使用 Vue 3 的响应式状态管理
- 每次刷新或点击都会随机选择图片
- 支持展开/折叠功能，节省页面空间

### 4. 一键复制

快速复制图片链接或文件夹名称，方便分享和协作。

**用户体验：**
- 点击复制按钮后显示成功提示
- 按钮状态变化反馈（从 📋 变为 ✅）
- 自动使用剪贴板 API，无需手动复制

## 技术栈

Photo Vault 采用了现代化的前端技术栈：

- **Vue 3** - 使用 Composition API 和 `<script setup>` 语法，代码更加简洁高效
- **Vite** - 极速的开发服务器和构建工具
- **Vue Router** - 灵活的路由管理
- **Sharp** - 高性能的图片处理库

## 项目架构

```
src/
├── components/      # Vue 组件
│   ├── Home.vue     # 主页面，负责整体布局
│   ├── FileTree.vue # 文件树组件，核心功能
│   ├── RandomImage.vue # 随机图片组件
│   └── SearchBar.vue # 搜索框组件
├── data/
│   └── imageData.js # 图片数据，由 Vite 插件自动生成
├── router/
│   └── index.js     # 路由配置
├── utils/
│   ├── browserUtils.js # 浏览器工具函数
│   ├── imageScanner.js # 图片扫描器
│   └── vite-plugin-*.js # 自定义 Vite 插件
```

## 技术实现细节

### 1. 图片数据自动扫描

我编写了一个自定义的 Vite 插件 `vite-plugin-image-scanner`，它会在构建时自动扫描 `public/website/` 目录下的所有图片文件，并生成包含图片元数据（尺寸、大小、类型等）的 JSON 文件。

**优势：**
- 无需手动维护图片列表
- 自动获取图片尺寸和大小信息
- 构建时处理，不影响运行时性能

### 2. 响应式设计

Photo Vault 完美适配桌面端和移动端：

```css
@media (max-width: 768px) {
  .app-main {
    grid-template-rows: auto auto;
  }
  
  .file-info {
    display: none; /* 移动端隐藏详细信息 */
  }
}
```

### 3. 搜索算法优化

搜索功能采用了精确匹配算法：

```javascript
const filteredFolders = computed(() => {
  if (!searchTerm.value) {
    return folders.value;
  }
  const searchLower = searchTerm.value.toLowerCase();
  return folders.value.map(folder => {
    const matchingFiles = folder.files.filter(file => 
      file.name.toLowerCase().includes(searchLower)
    );
    
    if (matchingFiles.length === 0) {
      return null;
    }
    
    return {
      ...folder,
      files: matchingFiles
    };
  }).filter(folder => folder !== null);
});
```

**关键点：**
- 使用 `map()` 而不是 `filter()`，保留原始文件夹结构
- 只返回包含匹配文件的文件夹
- 过滤后的文件列表直接替换原文件列表，避免重复过滤

## 部署与使用

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 生产构建

```bash
npm run build
```

构建产物将存储在 `dist/` 目录中，可以部署到任何静态网站托管服务。

### 部署选项

- **EdgeOne Pages** - 腾讯云的静态网站托管服务
- **GitHub Pages** - GitHub 的免费静态网站托管
- **Vercel** - 现代化的部署平台
- **Netlify** - 功能强大的静态网站托管

## 项目亮点

1. **自动化程度高** - 图片数据自动扫描，无需手动维护
2. **性能优秀** - 使用 Vite 构建，开发体验极佳
3. **代码简洁** - Vue 3 Composition API 让代码更加清晰
4. **用户体验好** - 响应式设计，支持移动端
5. **易于扩展** - 模块化设计，方便添加新功能

## 未来规划

- [ ] 支持图片标签和分类
- [ ] 添加图片收藏功能
- [ ] 支持批量操作（批量下载、批量删除）
- [ ] 添加图片预览灯箱效果
- [ ] 支持拖拽上传图片
- [ ] 添加图片编辑功能

## 总结

Photo Vault 是一个简单但实用的图片资源库管理系统。它解决了我在日常开发中遇到的图片管理痛点，帮助我更高效地浏览和分享图片资源。

如果你也在寻找一个轻量级的图片管理解决方案，不妨试试 Photo Vault。项目代码已开源，欢迎 Star 和 Fork！

**项目地址：** [GitHub](https://github.com)  
**在线演示：** [Demo](https://demo.olinl.com)  
**作者博客：** [拾柒小站](https://blog.olinl.com)

---

*Powered By Vue 3 & Vite* 🚀
