<template>
  <div class="random-image-container">
    <div class="random-image-label">🎲 随机图片 API</div>
    <!-- 当前随机图片路径（隐藏） -->
    <div id="randomImagePath" style="display: none;">{{ currentImagePath }}</div>
    
    <!-- 左右分布布局容器 -->
    <div class="random-image-layout">
      <!-- 左侧：图片预览 -->
      <div class="random-image-left">
        <div class="random-image-preview">
          <img 
            id="randomImagePreview" 
            ref="randomImagePreview" 
            :src="previewImageUrl" 
            alt="随机图片" 
            :style="{ display: previewImageUrl ? 'inline-block' : 'none' }"
            @click="refreshRandomImage"
            title="点击刷新"
          >
        </div>
      </div>
      
      <!-- 右侧：说明信息 -->
      <div class="random-image-right">
        <!-- API信息：文件夹选择和API地址 -->
        <div class="random-image-api-info">
          <div class="api-item">
            <span class="api-label">选择文件夹:</span>
            <select 
              id="folderSelect" 
              class="folder-select" 
              v-model="selectedFolder"
              @change="updateRandomImage"
            >
              <option value="">所有文件夹</option>
              <option 
                v-for="folder in folders" 
                :key="folder.name" 
                :value="folder.name"
              >
                {{ folder.name }}
              </option>
            </select>
          </div>
          <div class="api-item">
            <span class="api-label">API 地址:</span>
            <code id="apiUrl" class="api-url">{{ apiPath }}</code>
            <button class="copy-btn" @click="copyApiUrl">📋</button>
          </div>
        </div>
        <!-- API使用说明 -->
        <div class="random-image-description">
          不传参数默认遍历所有图片，选择文件夹则遍历指定文件夹下的图片
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getRandomImage } from '../utils/browserUtils.js';

const props = defineProps({
  imageData: {
    type: Object,
    required: true
  }
});

// 从imageData中获取需要的属性
const allImages = computed(() => props.imageData.allImages || []);
const folderImages = computed(() => props.imageData.folderImages || {});
const folders = computed(() => props.imageData.folders || []);

// 当前选择的文件夹
const selectedFolder = ref('Genshin'); // 默认选择 Genshin 文件夹
// 当前随机图片路径
const currentImagePath = ref('');
// 图片预览 URL
const randomImagePreview = ref(null);

// 计算属性：预览图片 URL
const previewImageUrl = computed(() => {
  if (!currentImagePath.value) return '';
  return window.location.origin + '/' + currentImagePath.value;
});

// 计算属性：API 路径
const apiPath = computed(() => {
  if (selectedFolder.value) {
    return `/random?folder=${encodeURIComponent(selectedFolder.value)}`;
  }
  return '/random';
});

// 更新随机图片
function updateRandomImage() {
  let randomImagePath = null;
  
  if (selectedFolder.value && folderImages.value[selectedFolder.value]) {
    randomImagePath = getRandomImage(folderImages.value[selectedFolder.value]);
  } else {
    randomImagePath = getRandomImage(allImages.value);
  }
  
  if (randomImagePath) {
    currentImagePath.value = randomImagePath;
  }
}

// 刷新随机图片
function refreshRandomImage() {
  updateRandomImage();
}

// 复制随机图片 API 地址到剪贴板
function copyApiUrl() {
  const baseUrl = window.location.origin;
  const fullUrl = baseUrl + apiPath.value;
  
  navigator.clipboard.writeText(fullUrl).then(() => {
    showToast('✅ API地址已复制到剪贴板');
  }).catch(err => {
    alert('复制失败，请手动复制: ' + fullUrl);
  });
}

// 定义事件
const emit = defineEmits(['show-toast']);

// 显示提示信息
function showToast(message) {
  emit('show-toast', message);
}

// 组件挂载后初始化随机图片
onMounted(() => {
  updateRandomImage();
});
</script>

<style scoped>
/* 随机图片区域样式 */
.random-image-container {
  margin-bottom: 30px;
}

.random-image-label {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 15px;
  display: block;
}

/* 左右分布布局 */
.random-image-layout {
  display: grid;
  grid-template-columns: 1.2fr 1.3fr;
  gap: 20px;
  align-items: start;
}

/* 左侧：图片预览 */
.random-image-left {
  width: 100%;
}

.random-image-preview {
  text-align: center;
  cursor: pointer;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.random-image-preview img {
  max-width: 100%;
  max-height: 500px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.random-image-preview img:hover {
  transform: scale(1.02);
}

/* 右侧：API信息 */
.random-image-right {
  width: 100%;
}

/* 随机图片API信息样式 */
.random-image-api-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 10px;
}

.api-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.api-label {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  min-width: 100px;
}

.api-url {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #333;
  background: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.api-item .copy-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
  flex-shrink: 0;
}

.api-item .copy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);
}

/* 文件夹选择下拉菜单样式 */
.folder-select {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #333;
  background: white;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  outline: none;
  transition: border-color 0.3s ease;
}

.folder-select:hover {
  border-color: #667eea;
}

.folder-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.folder-select option {
  background: white;
  color: #333;
}

.random-image-description {
  font-size: 0.9rem;
  color: #666;
  margin-top: 15px;
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

/* 响应式设计 - 移动端适配 */
@media (max-width: 768px) {
  .random-image-container {
    margin-bottom: 20px;
  }
  
  /* 在移动端改为上下布局 */
  .random-image-layout {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .random-image-preview {
    min-height: 200px;
    padding: 10px;
  }

  .random-image-preview img {
    max-height: 300px;
  }

  .api-item {
    padding: 8px 10px;
  }

  .api-label {
    min-width: 70px;
    font-size: 0.75rem;
  }

  .api-url, .folder-select {
    font-size: 0.75rem;
  }
}
</style>