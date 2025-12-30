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
      <h1>图片资源库</h1>
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

@media (max-width: 768px) {
  .app-main {
    grid-template-rows: auto auto;
  }
  
  .section-title {
    font-size: 1.2em;
  }
}
</style>
