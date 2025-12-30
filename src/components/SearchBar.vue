<template>
  <div class="search-container">
    <input 
      type="text" 
      id="searchInput" 
      class="search-input" 
      placeholder="搜索文件..." 
      v-model="searchTerm"
      @input="handleSearch"
    >
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 搜索词
const searchTerm = ref('');

// 定义事件
const emit = defineEmits(['search']);

// 处理搜索输入
function handleSearch() {
  emit('search', searchTerm.value);
}

// 暴露方法供父组件调用
defineExpose({
  clearSearch() {
    searchTerm.value = '';
    handleSearch();
  }
});
</script>

<style scoped>
/* 搜索框容器样式 */
.search-container {
  margin-bottom: 0;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  font-size: 1rem;
  background: white;
  color: #333;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #999;
}

.search-input:focus {
  background: white;
  border-color: #667eea;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
}

/* 响应式设计 - 移动端适配 */
@media (max-width: 768px) {
  .search-container {
    margin-bottom: 20px;
  }

  .search-input {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}
</style>