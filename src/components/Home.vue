<script setup>
import { ref } from 'vue'
import FileTree from './FileTree.vue'
import RandomImage from './RandomImage.vue'
import SearchBar from './SearchBar.vue'
import { imageData } from '../data/imageData.js'

// 搜索词状态
const searchTerm = ref('')

// 栏目展开/收起状态
const isRandomImageExpanded = ref(true)
const isFileTreeExpanded = ref(true)

// 切换栏目展开/收起状态
const toggleRandomImage = () => {
  isRandomImageExpanded.value = !isRandomImageExpanded.value
}

const toggleFileTree = () => {
  isFileTreeExpanded.value = !isFileTreeExpanded.value
}

// 处理搜索
const handleSearch = (term) => {
  searchTerm.value = term
}
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>📸 Photo Vault</h1>
      <p class="app-subtitle">我的图片收藏库</p>
    </header>
    
    <main class="app-main">
      <div class="content-section">
        <div class="section-header" @click="toggleRandomImage">
          <h2 class="section-title">随机图片</h2>
          <span class="section-toggle">
            {{ isRandomImageExpanded ? '▼' : '▶' }}
          </span>
        </div>
        <div class="section-content" :class="{ 'collapsed': !isRandomImageExpanded }">
          <RandomImage :image-data="imageData" />
        </div>
      </div>
      
      <div class="content-section">
        <div class="section-header" @click="toggleFileTree">
          <h2 class="section-title">文件树</h2>
          <span class="section-toggle">
            {{ isFileTreeExpanded ? '▼' : '▶' }}
          </span>
        </div>
        <div class="section-content" :class="{ 'collapsed': !isFileTreeExpanded }">
          <FileTree :image-data="imageData" />
        </div>
      </div>
    </main>
    
    <footer class="app-footer">
      <div class="footer-line">
        <span class="powered-by">Powered By <a href="https://blog.olinl.com" target="_blank" class="site-link">拾柒小站</a></span>
      </div>
      <div class="footer-line">
        <a href="https://github.com/jianglinper/photo_vault" target="_blank" class="github-link">
          <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>GitHub Project</span>
        </a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.app-header h1 {
  margin: 0;
  color: #333;
}

.app-subtitle {
  margin: 5px 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.app-main {
  display: grid;
  grid-template-rows: auto auto;
  gap: 30px;
}

.content-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 栏目标题栏样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 5px 0;
  margin-bottom: 15px;
  user-select: none;
}

.section-title {
  margin: 0;
  color: #444;
  font-size: 1.5em;
  transition: color 0.3s ease;
}

.section-header:hover .section-title {
  color: #667eea;
}

/* 展开/收起状态指示 */
.section-toggle {
  font-size: 0.8em;
  color: #999;
  transition: transform 0.3s ease;
}

.section-header:hover .section-toggle {
  color: #667eea;
}

/* 栏目内容区域 */
.section-content {
  overflow: hidden;
  transition: all 0.3s ease;
  max-height: 1000px; /* 足够大的值以容纳内容 */
  opacity: 1;
}

/* 收缩状态样式 */
.section-content.collapsed {
  max-height: 0;
  opacity: 0;
  margin: 0;
  padding: 0;
}

/* 页脚样式 */
.app-footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.footer-line {
  display: flex;
  align-items: center;
  justify-content: center;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.github-link:hover {
  color: #667eea;
  transform: translateY(-2px);
}

.github-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.powered-by {
  color: #999;
  font-size: 0.85rem;
}

.site-link {
  color: #999;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 2px 6px;
  border-radius: 4px;
}

.site-link:hover {
  color: #764ba2;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

@media (max-width: 768px) {
  .app-main {
    grid-template-rows: auto auto;
  }
  
  .section-title {
    font-size: 1.2em;
  }
  
  .app-footer {
    gap: 10px;
  }
}
</style>
