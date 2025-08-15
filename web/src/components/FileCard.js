import React, { useState } from 'react';
import { Card, Icon, Button, Popup, Modal, Header, Segment } from 'semantic-ui-react';
import { API, copy, showError, showSuccess, canDeleteFile } from '../helpers';

const FileCard = ({ file, onDelete, onRefresh }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);

  const downloadFile = (link, filename) => {
    let linkElement = document.createElement('a');
    linkElement.download = filename;
    linkElement.href = '/upload/' + link;
    linkElement.click();
  };

  const copyLink = (link) => {
    let url = window.location.origin + '/upload/' + link;
    copy(url).then();
    showSuccess('链接已复制到剪贴板');
  };

  const deleteFile = async () => {
    try {
      const res = await API.delete(`/api/file/${file.id}`);
      const { success, message } = res.data;
      if (success) {
        showSuccess('文件已删除！');
        onDelete(file.id);
      } else {
        showError(message);
      }
    } catch (error) {
      showError('删除失败');
    }
  };

  const previewFile = async () => {
    if (fileContent) {
      setShowPreview(true);
      return;
    }

    setLoadingContent(true);
    try {
      const response = await fetch(`/upload/${file.link}`);
      const content = await response.text();
      setFileContent(content);
      setShowPreview(true);
    } catch (error) {
      showError('无法预览文件内容');
    } finally {
      setLoadingContent(false);
    }
  };

  const getFilePreview = (content, filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    
    if (ext === 'specs' || ext === 'json') {
      try {
        const jsonData = JSON.parse(content);
        return (
          <div>
            <Header as='h4'>文件内容预览</Header>
            <Segment>
              <pre style={{ 
                whiteSpace: 'pre-wrap', 
                wordWrap: 'break-word',
                fontSize: '12px',
                lineHeight: '1.4',
                maxHeight: '400px',
                overflow: 'auto',
                backgroundColor: '#f8f9fa',
                padding: '12px',
                borderRadius: '4px'
              }}>
                {JSON.stringify(jsonData, null, 2)}
              </pre>
            </Segment>
          </div>
        );
      } catch (e) {
        return (
          <div>
            <Header as='h4'>文件内容预览</Header>
            <Segment>
              <pre style={{ 
                whiteSpace: 'pre-wrap', 
                wordWrap: 'break-word',
                fontSize: '12px',
                lineHeight: '1.4',
                maxHeight: '400px',
                overflow: 'auto',
                backgroundColor: '#f8f9fa',
                padding: '12px',
                borderRadius: '4px'
              }}>
                {content}
              </pre>
            </Segment>
          </div>
        );
      }
    }
    
    return (
      <div>
        <Header as='h4'>文件内容预览</Header>
        <Segment>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            wordWrap: 'break-word',
            fontSize: '12px',
            lineHeight: '1.4',
            maxHeight: '400px',
            overflow: 'auto',
            backgroundColor: '#f8f9fa',
            padding: '12px',
            borderRadius: '4px'
          }}>
            {content}
          </pre>
        </Segment>
      </div>
    );
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'specs':
        return 'file code outline';
      case 'txt':
        return 'file text outline';
      case 'json':
        return 'file code outline';
      case 'md':
        return 'file text outline';
      default:
        return 'file outline';
    }
  };

  const formatFileSize = (size) => {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB';
    return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '昨天';
    if (diffDays === 2) return '前天';
    if (diffDays <= 7) return `${diffDays}天前`;
    
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Card fluid>
        <Card.Content>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Icon name={getFileIcon(file.filename)} size='large' style={{ marginRight: '8px' }} />
              <div>
                <Card.Header style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                  {file.filename}
                </Card.Header>
                <Card.Meta style={{ fontSize: '12px', color: '#666' }}>
                  {formatFileSize(file.filename.length * 100)} {/* 模拟文件大小 */}
                </Card.Meta>
              </div>
            </div>
          </div>
          
          <Card.Description style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '14px', color: '#333', marginBottom: '4px' }}>
              由 {file.uploader} 上传 · {file.description || '一般对话'}
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              更新于 {formatDate(file.upload_time)}
            </div>
          </Card.Description>
        </Card.Content>

        <Card.Content extra>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Popup content="预览" trigger={
              <Button 
                icon 
                size='mini' 
                onClick={previewFile}
                loading={loadingContent}
              >
                <Icon name='eye' />
              </Button>
            } />
            
            <Popup content="下载" trigger={
              <Button 
                icon 
                size='mini' 
                onClick={() => downloadFile(file.link, file.filename)}
              >
                <Icon name='download' />
              </Button>
            } />
            
            <Popup content="分享" trigger={
              <Button 
                icon 
                size='mini' 
                onClick={() => copyLink(file.link)}
              >
                <Icon name='share' />
              </Button>
            } />
            
            {canDeleteFile(file) && (
              <Popup content="删除" trigger={
                <Button 
                  icon 
                  size='mini' 
                  negative 
                  onClick={deleteFile}
                >
                  <Icon name='trash' />
                </Button>
              } />
            )}
          </div>
        </Card.Content>
      </Card>

      {/* 文件预览模态框 */}
      <Modal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        size='large'
      >
        <Modal.Header>
          <Header as='h3'>
            <Icon name={getFileIcon(file.filename)} />
            <Header.Content>
              {file.filename}
              <Header.Subheader>
                由 {file.uploader} 上传 · {formatDate(file.upload_time)}
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Modal.Header>
        
        <Modal.Content>
          {getFilePreview(fileContent, file.filename)}
        </Modal.Content>
        
        <Modal.Actions>
          <Button onClick={() => setShowPreview(false)}>
            关闭
          </Button>
          <Button 
            positive 
            onClick={() => downloadFile(file.link, file.filename)}
          >
            下载
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default FileCard;
