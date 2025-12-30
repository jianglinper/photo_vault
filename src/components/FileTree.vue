<template>
  <div class="tree-container">
    <div class="tree-search">
      <SearchBar @search="handleSearch" />
    </div>
    <h2 class="tree-header">📂 /</h2>
    <div class="tree-root">
      <!-- 根目录文件 -->
      <div 
        v-for="file in filteredRootFiles" 
        :key="file.path" 
        class="tree-item file-item"
        :data-path="file.path"
      >
        <span class="tree-icon clickable" @click="previewLink(file.path)">🖼️</span>
        <span class="tree-name clickable" @click="previewLink(file.path)">{{ file.name }}</span>
        <span class="file-info">
          <span class="file-type">{{ file.ext.substring(1).toUpperCase() }}{{ file.dimensions ? ` (${file.dimensions})` : '' }}</span>
          <span class="file-size">{{ formatFileSize(file.size) }}</span>
        </span>
        <button class="copy-btn" @click="copyLink(file.path, $event.target)">📋</button>
      </div>
      
      <!-- 文件夹 -->
      <div 
        v-for="folder in filteredFolders" 
        :key="folder.name"
        class="tree-item folder-item"
        :class="{ collapsed: !expandedFolders[folder.name] }"
      >
        <div class="folder-toggle" @click="toggleFolder(folder.name)">
          <span class="toggle-icon">▶</span>
          <span class="tree-icon">📁</span>
          <span class="tree-name">{{ folder.name }}</span>
          <span class="folder-count">({{ folder.files.filter(file => !searchTerm.value || file.name.toLowerCase().includes(searchTerm.value.toLowerCase())).length }})</span>
          <button class="copy-btn copy-folder-btn" @click="copyFolderName(folder.name, $event.target)">📋</button>
        </div>
        <div class="folder-content">
          <div 
        v-for="file in folder.files.filter(file => !searchTerm.value || file.name.toLowerCase().includes(searchTerm.value.toLowerCase()))" 
        :key="file.path"
            class="tree-item file-item"
            :data-path="file.path"
          >
            <span class="tree-icon clickable" @click="previewLink(file.path)">🖼️</span>
            <span class="tree-name clickable" @click="previewLink(file.path)">{{ file.name }}</span>
            <span class="file-info">
              <span class="file-type">{{ file.ext.substring(1).toUpperCase() }}{{ file.dimensions ? ` (${file.dimensions})` : '' }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
            </span>
            <button class="copy-btn" @click="copyLink(file.path, $event.target)">📋</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { formatFileSize } from '../utils/browserUtils.js';
import SearchBar from './SearchBar.vue';

const props = defineProps({
  imageData: {
    type: Object,
    required: true
  }
});

// 定义事件
const emit = defineEmits(['search', 'show-toast']);

// 处理搜索事件
const handleSearch = (term) => {
  searchTerm.value = term;
  emit('search', term);
  console.log('搜索词:', term);
  // 打印匹配的文件
  const matchingFiles = [];
  
  // 使用与界面相同的过滤逻辑
  // 根目录文件
  filteredRootFiles.value.forEach(file => {
    matchingFiles.push(`根目录: ${file.name}`);
  });
  
  // 文件夹内的文件
  filteredFolders.value.forEach(folder => {
    const filteredFiles = folder.files.filter(file => 
      file.name.toLowerCase().includes(term.toLowerCase())
    );
    filteredFiles.forEach(file => {
      matchingFiles.push(`${folder.name}: ${file.name}`);
    });
  });
  
  console.log('匹配的文件:', matchingFiles);
  console.log('匹配文件总数:', matchingFiles.length);
};

// 从imageData中获取需要的属性
const folders = computed(() => props.imageData.folders || []);
const rootFiles = computed(() => props.imageData.rootFiles || []);

// 搜索词状态
const searchTerm = ref('');

// 展开的文件夹状态
const expandedFolders = ref({});

// 监听外部搜索事件
function updateSearchTerm(term) {
  searchTerm.value = term;
};

// 监听搜索词变化，自动展开包含匹配文件的文件夹
watch(searchTerm, (newTerm) => {
  if (newTerm) {
    // 重置展开状态
    expandedFolders.value = {};
    
    // 查找所有包含匹配文件的文件夹并展开
    folders.value.forEach(folder => {
      const hasMatchingFiles = folder.files.some(file => 
        file.name.toLowerCase().includes(newTerm.toLowerCase())
      );
      if (hasMatchingFiles) {
        expandedFolders.value[folder.name] = true;
      }
    });
  }
});



// 切换文件夹展开/折叠状态
function toggleFolder(folderName) {
  expandedFolders.value[folderName] = !expandedFolders.value[folderName];
}

// 过滤后的文件夹和文件（根据搜索词）
const filteredRootFiles = computed(() => {
  if (!searchTerm.value) {
    return rootFiles.value;
  }
  return rootFiles.value.filter(file => 
    file.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const filteredFolders = computed(() => {
  if (!searchTerm.value) {
    return folders.value;
  }
  return folders.value.filter(folder => {
    // 检查文件夹名称是否匹配搜索词
    const folderMatches = folder.name.toLowerCase().includes(searchTerm.value.toLowerCase());
      // 检查文件夹内是否有匹配的文件
      const hasMatchingFiles = folder.files.some(file => 
        file.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    return folderMatches || hasMatchingFiles;
  });
});

// 在新窗口中预览文件
function previewLink(filePath) {
  const baseUrl = window.location.origin;
  const fullUrl = baseUrl + '/' + filePath;
  window.open(fullUrl, '_blank');
}

// 复制文件链接到剪贴板
function copyLink(filePath, btn) {
  const baseUrl = window.location.origin;
  const fullUrl = baseUrl + '/' + filePath;
  
  navigator.clipboard.writeText(fullUrl).then(() => {
    showToast('✅ 链接已复制到剪贴板');
    
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅';
    btn.classList.add('copied');
    
    btn.onmouseout = function() {
      btn.innerHTML = originalText;
      btn.classList.remove('copied');
      btn.onmouseout = null;
    };
  }).catch(err => {
    alert('复制失败，请手动复制: ' + fullUrl);
  });
}

// 复制文件夹名称到剪贴板
function copyFolderName(folderName, btn) {
  navigator.clipboard.writeText(folderName).then(() => {
    showToast('✅ 文件夹名称已复制到剪贴板');
    
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅';
    btn.classList.add('copied');
    
    btn.onmouseout = function() {
      btn.innerHTML = originalText;
      btn.classList.remove('copied');
      btn.onmouseout = null;
    };
  }).catch(err => {
    alert('复制失败，请手动复制: ' + folderName);
  });
}

// 显示提示信息
function showToast(message) {
  emit('show-toast', message);
}
</script>

<style scoped>
/* 文件树容器样式 */
.tree-container {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* 搜索栏容器样式 */
.tree-search {
  margin-bottom: 20px;
  width: 100%;
}

.tree-header {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
}

.tree-root {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 文件树项目样式 */
.tree-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  gap: 8px;
}

.tree-item:hover {
  background-color: #f8f9fa;
}

/* 文件夹项目样式 */
.folder-item {
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  background: transparent;
}

.folder-toggle {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  gap: 8px;
}

.folder-toggle:hover {
  background-color: #f8f9fa;
}

.toggle-icon {
  font-size: 0.8rem;
  color: #666;
  transition: transform 0.2s ease;
  width: 16px;
}

.folder-item.collapsed .toggle-icon {
  transform: rotate(0deg);
}

.folder-item:not(.collapsed) .toggle-icon {
  transform: rotate(90deg);
}

.folder-content {
  display: none;
  padding-left: 32px;
  flex-direction: column;
  gap: 4px;
}

.folder-item:not(.collapsed) .folder-content {
  display: flex;
}

/* 文件树图标和名称样式 */
.tree-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.tree-name {
  flex: 1;
  font-weight: 500;
  color: #333;
  word-break: break-all;
  text-align: left;
}

/* 文件信息样式 */
.file-info {
  color: #999;
  font-size: 0.85rem;
  margin-right: 8px;
  white-space: nowrap;
}

.file-type {
  margin-right: 8px;
}

.file-size {
  color: #999;
}

/* 可点击元素样式 */
.tree-icon.clickable, .tree-name.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

/* 文件夹数量样式 */
.folder-count {
  color: #999;
  font-size: 0.85rem;
  font-weight: 600;
}

/* 复制按钮样式 */
.copy-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
  flex-shrink: 0;
}

.copy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);
}

.copy-btn:active {
  transform: translateY(0);
}

.copy-btn.copied {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

/* 隐藏元素样式 */
.tree-item.hidden {
  display: none !important;
}

.folder-item.hidden {
  display: none !important;
}

/* 响应式设计 - 移动端适配 */
@media (max-width: 768px) {
  .tree-container {
    padding: 20px;
  }

  .tree-item,
  .folder-toggle {
    padding: 8px 10px;
  }

  .tree-name {
    font-size: 0.9rem;
  }

  .file-info {
    font-size: 0.75rem;
    display: none;
  }

  .copy-btn {
    padding: 5px 10px;
    font-size: 0.75rem;
  }
}
</style>