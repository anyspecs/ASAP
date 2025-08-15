import React from 'react';
import { Menu, Header, Divider } from 'semantic-ui-react';

const FileFilter = ({ 
  activeCategory, 
  onCategoryChange, 
  activeSort, 
  onSortChange,
  totalFiles,
  myFiles
}) => {
  const categories = [
    { key: 'all', text: '所有上下文', icon: 'folder outline' },
    { key: 'my', text: '我的上下文', icon: 'user outline' }
  ];

  const sortOptions = [
    { key: 'filename', text: '文件名', icon: 'sort alphabet down' },
    { key: 'upload_time', text: '更新时间', icon: 'clock outline' },
    { key: 'file_size', text: '文件大小', icon: 'sort numeric down' }
  ];

  return (
    <div style={{ width: '100%', padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Header as='h4' style={{ marginBottom: '20px', color: '#333' }}>
        过滤器
      </Header>
      
      {/* 类别筛选 */}
      <div style={{ marginBottom: '30px' }}>
        <Header as='h5' style={{ marginBottom: '15px', color: '#666' }}>
          类别
        </Header>
        <Menu vertical fluid>
          {categories.map(category => (
            <Menu.Item
              key={category.key}
              name={category.key}
              active={activeCategory === category.key}
              onClick={() => onCategoryChange(category.key)}
              style={{
                borderRadius: '8px',
                marginBottom: '8px',
                backgroundColor: activeCategory === category.key ? '#e3f2fd' : 'transparent',
                color: activeCategory === category.key ? '#1976d2' : '#333'
              }}
            >
              <Menu.Header>
                <i className={`icon ${category.icon}`} style={{ marginRight: '8px' }}></i>
                {category.text}
              </Menu.Header>
            </Menu.Item>
          ))}
        </Menu>
      </div>

      <Divider />

      {/* 排序选项 */}
      <div style={{ marginBottom: '30px' }}>
        <Header as='h5' style={{ marginBottom: '15px', color: '#666' }}>
          排序方式
        </Header>
        <Menu vertical fluid>
          {sortOptions.map(sort => (
            <Menu.Item
              key={sort.key}
              name={sort.key}
              active={activeSort === sort.key}
              onClick={() => onSortChange(sort.key)}
              style={{
                borderRadius: '8px',
                marginBottom: '8px',
                backgroundColor: activeSort === sort.key ? '#e3f2fd' : 'transparent',
                color: activeSort === sort.key ? '#1976d2' : '#333'
              }}
            >
              <Menu.Header>
                <i className={`icon ${sort.icon}`} style={{ marginRight: '8px' }}></i>
                {sort.text}
              </Menu.Header>
            </Menu.Item>
          ))}
        </Menu>
      </div>

      <Divider />

      {/* 统计信息 */}
      <div style={{ marginBottom: '20px' }}>
        <Header as='h5' style={{ marginBottom: '15px', color: '#666' }}>
          统计信息
        </Header>
        <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
          <div>总文件数: <strong>{totalFiles || 0}</strong></div>
          <div>我的文件: <strong>{myFiles || 0}</strong></div>
          <div>共享文件: <strong>{(totalFiles || 0) - (myFiles || 0)}</strong></div>
        </div>
      </div>
    </div>
  );
};

export default FileFilter;
