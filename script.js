// 切换文件夹的展开/折叠状态
function toggleFolder(element) {
    const folderItem = element.closest('.folder-item');
    folderItem.classList.toggle('collapsed');
}

// 处理搜索功能，根据搜索词过滤显示的文件和文件夹
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const allFileItems = document.querySelectorAll('.file-item');
    const allFolderItems = document.querySelectorAll('.folder-item');

    if (searchTerm === '') {
        allFileItems.forEach(item => item.classList.remove('hidden'));
        allFolderItems.forEach(item => item.classList.remove('hidden'));
        return;
    }

    allFileItems.forEach(item => {
        const fileName = item.querySelector('.tree-name').textContent.toLowerCase();
        if (fileName.includes(searchTerm)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });

    allFolderItems.forEach(folder => {
        const folderContent = folder.querySelector('.folder-content');
        const folderFiles = folderContent.querySelectorAll('.file-item');
        let hasVisibleFile = false;

        folderFiles.forEach(file => {
            if (!file.classList.contains('hidden')) {
                hasVisibleFile = true;
            }
        });

        if (hasVisibleFile) {
            folder.classList.remove('hidden');
            folder.classList.remove('collapsed');
        } else {
            folder.classList.add('hidden');
        }
    });
}

// 复制文件链接到剪贴板
function copyLink(filePath, btn) {
    const baseUrl = window.location.origin;
    const fullUrl = baseUrl + '/' + filePath;
    
    navigator.clipboard.writeText(fullUrl).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅';
        btn.classList.add('copied');
        
        btn.onmouseout = function() {
            toast.classList.remove('show');
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
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅';
        btn.classList.add('copied');
        
        btn.onmouseout = function() {
            toast.classList.remove('show');
            btn.innerHTML = originalText;
            btn.classList.remove('copied');
            btn.onmouseout = null;
        };
    }).catch(err => {
        alert('复制失败，请手动复制: ' + folderName);
    });
}

// 在新窗口中预览文件
function previewLink(filePath) {
    const baseUrl = window.location.origin;
    const fullUrl = baseUrl + '/' + filePath;
    window.open(fullUrl, '_blank');
}

// 复制随机图片链接到剪贴板
function copyRandomImage() {
    const randomImagePath = document.getElementById('randomImagePath').textContent;
    if (!randomImagePath) return;
    
    const baseUrl = window.location.origin;
    const fullUrl = baseUrl + '/' + randomImagePath;
    
    navigator.clipboard.writeText(fullUrl).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }).catch(err => {
        alert('复制失败，请手动复制: ' + fullUrl);
    });
}

// 复制随机图片API地址到剪贴板
function copyApiUrl() {
    const folderSelect = document.getElementById('folderSelect');
    const selectedFolder = folderSelect.value;
    let apiPath = '/random';
    
    if (selectedFolder) {
        apiPath = '/random?folder=' + encodeURIComponent(selectedFolder);
    }
    
    const baseUrl = window.location.origin;
    const fullUrl = baseUrl + apiPath;
    
    navigator.clipboard.writeText(fullUrl).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }).catch(err => {
        alert('复制失败，请手动复制: ' + fullUrl);
    });
}

// 更新随机图片预览和API地址
// 当下拉菜单选择变化时调用
function updateRandomImage() {
    const folderSelect = document.getElementById('folderSelect');
    const selectedFolder = folderSelect.value;
    const apiUrlElement = document.getElementById('apiUrl');
    const preview = document.getElementById('randomImagePreview');
    
    let apiPath = '/random';
    if (selectedFolder) {
        apiPath = '/random?folder=' + encodeURIComponent(selectedFolder);
    }
    
    apiUrlElement.textContent = apiPath;
    preview.style.display = 'inline-block';
    preview.src = apiPath + (apiPath.includes('?') ? '&' : '?') + 't=' + new Date().getTime();
}

// 刷新随机图片预览
function refreshRandomImage() {
    const preview = document.getElementById('randomImagePreview');
    if (preview) {
        preview.src = '/random?' + new Date().getTime();
    }
}

// 滚动到页面顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 监听滚动事件，控制返回顶部按钮的显示/隐藏
window.addEventListener('scroll', function() {
    const backToTopBtn = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});
