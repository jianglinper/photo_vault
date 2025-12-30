<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-message">页面未找到</h2>
      <p class="error-description">您访问的页面不存在或已被移除</p>
      <router-link to="/" class="back-home-btn">返回首页</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.not-found-content {
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.error-code {
  font-size: 6rem;
  font-weight: bold;
  color: #ff4d4f;
  margin: 0;
}

.error-message {
  font-size: 2rem;
  color: #333;
  margin: 20px 0;
}

.error-description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.back-home-btn {
  display: inline-block;
  padding: 10px 30px;
  font-size: 1rem;
  color: white;
  background-color: #1890ff;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.back-home-btn:hover {
  background-color: #40a9ff;
}
</style>
