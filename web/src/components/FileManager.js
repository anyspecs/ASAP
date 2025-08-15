import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Header, 
  Input, 
  Button, 
  Icon, 
  Segment, 
  Pagination,
  Dropdown,
  Message
} from 'semantic-ui-react';
import { API, showError, showSuccess } from '../helpers';
import FileFilter from './FileFilter';
import FileCard from './FileCard';
import { useDropzone } from 'react-dropzone';
import './FileManager.css';

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('upload_time');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [uploading, setUploading] = useState(false);
  
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const loadFiles = async (startIdx) => {
    try {
      const res = await API.get(`/api/file/?p=${startIdx}`);
      const { success, message, data } = res.data;
      if (success) {
        if (startIdx === 0) {
          setFiles(data);
        } else {
          let newFiles = files;
          newFiles.push(...data);
          setFiles(newFiles);
        }
      } else {
        showError(message);
      }
    } catch (error) {
      showError('加载文件失败');
    } finally {
      setLoading(false);
    }
  };

  const searchFiles = async () => {
    if (searchKeyword === '') {
      await loadFiles(0);
      setActivePage(1);
      return;
    }
    
    setSearching(true);
    try {
      const res = await API.get(`/api/file/search?keyword=${searchKeyword}`);
      const { success, message, data } = res.data;
      if (success) {
        setFiles(data);
        setActivePage(1);
      } else {
        showError(message);
      }
    } catch (error) {
      showError('搜索失败');
    } finally {
      setSearching(false);
    }
  };

  const handleKeywordChange = (e, { value }) => {
    setSearchKeyword(value.trim());
  };

  const handleSort = (sortKey) => {
    setActiveSort(sortKey);
    const sortedFiles = [...files].sort((a, b) => {
      switch (sortKey) {
        case 'filename':
          return a.filename.localeCompare(b.filename);
        case 'upload_time':
          return new Date(b.upload_time) - new Date(a.upload_time);
        case 'file_size':
          return (b.filename.length * 100) - (a.filename.length * 100);
        default:
          return 0;
      }
    });
    setFiles(sortedFiles);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setActivePage(1); // 重置到第一页
    // 不需要重新加载文件，只需要重新过滤
  };

  const handleFileDelete = (fileId) => {
    setFiles(files.filter(file => file.id !== fileId));
  };

  const uploadFiles = async () => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    try {
      let formData = new FormData();
      for (let i = 0; i < acceptedFiles.length; i++) {
        formData.append('file', acceptedFiles[i]);
      }
      
      const res = await API.post(`/api/file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const { success, message } = res.data;
      if (success) {
        showSuccess(`${acceptedFiles.length} 个文件上传成功！`);
        loadFiles(0);
        setActivePage(1);
      } else {
        showError(message);
      }
    } catch (error) {
      showError('上传失败');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    loadFiles(0);
  }, []);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      uploadFiles();
    }
  }, [acceptedFiles]);

  const filteredFiles = files.filter(file => {
    if (activeCategory === 'my') {
      // 获取当前用户信息，只显示当前用户上传的文件
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      return file.uploader_id === currentUser.id;
    }
    return true; // 显示所有文件
  });

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFiles = filteredFiles.slice(startIndex, endIndex);

      return (
      <Grid style={{ margin: 0, width: '100%' }}>
        {/* 左侧过滤器 */}
        <Grid.Column width={3} style={{ padding: 0, minWidth: '250px' }}>
          <FileFilter
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            activeSort={activeSort}
            onSortChange={handleSort}
            totalFiles={files.length}
            myFiles={files.filter(file => {
              const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
              return file.uploader_id === currentUser.id;
            }).length}
          />
        </Grid.Column>

        {/* 右侧主内容区 */}
        <Grid.Column width={13} style={{ padding: '20px', flex: 1 }}>
        {/* 顶部标题和搜索栏 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Header as='h2' style={{ margin: 0 }}>
            {activeCategory === 'all' ? '所有上下文' : '我的上下文'} 共{filteredFiles.length}个文件
          </Header>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* 搜索框 */}
            <Input
              placeholder="搜索所有用户的文件..."
              value={searchKeyword}
              onChange={handleKeywordChange}
              onKeyPress={(e) => e.key === 'Enter' && searchFiles()}
              icon={
                <Icon 
                  name='search' 
                  link 
                  onClick={searchFiles}
                  loading={searching}
                />
              }
              style={{ width: '300px' }}
            />
            
            {/* 刷新按钮 */}
            <Button 
              icon 
              onClick={() => loadFiles(0)}
              loading={loading}
            >
              <Icon name='refresh' />
            </Button>
            
            {/* 视图切换 */}
            <Button.Group size='mini'>
              <Button 
                icon 
                active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
              >
                <Icon name='grid layout' />
              </Button>
              <Button 
                icon 
                active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
              >
                <Icon name='list' />
              </Button>
            </Button.Group>
          </div>
        </div>

        {/* 拖拽上传区域 */}
        <Segment
          placeholder
          {...getRootProps({ className: 'dropzone' })}
          loading={uploading}
          style={{ 
            cursor: 'pointer', 
            border: '2px dashed #ccc',
            backgroundColor: '#fafafa',
            marginBottom: '20px'
          }}
        >
          <Header icon>
            <Icon name='cloud upload' />
            {uploading ? '正在上传...' : '拖拽上传或点击上传'}
          </Header>
          <input {...getInputProps()} />
        </Segment>

        {/* 文件展示区域 */}
        {loading ? (
          <Message>
            <Icon name='circle notched' loading />
            正在加载文件...
          </Message>
        ) : currentFiles.length === 0 ? (
          <Message info>
            <Icon name='info circle' />
            暂无文件
          </Message>
        ) : (
          <>
            {/* 网格视图 */}
            {viewMode === 'grid' && (
              <Grid columns={3} stackable>
                {currentFiles.map((file) => (
                  <Grid.Column key={file.id}>
                    <FileCard 
                      file={file} 
                      onDelete={handleFileDelete}
                      onRefresh={() => loadFiles(0)}
                    />
                  </Grid.Column>
                ))}
              </Grid>
            )}

            {/* 分页 */}
            {totalPages > 1 && (
              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <Pagination
                  activePage={activePage}
                  totalPages={totalPages}
                  onPageChange={(e, { activePage }) => setActivePage(activePage)}
                  size='small'
                  siblingRange={1}
                />
              </div>
            )}
          </>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default FileManager;
