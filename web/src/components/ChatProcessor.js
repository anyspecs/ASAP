import React, { useState, useCallback } from 'react';
import { 
  Button, 
  Icon, 
  Header, 
  List, 
  Card,
  Message
} from 'semantic-ui-react';
import { useDropzone } from 'react-dropzone';
import { showSuccess, showError } from '../helpers';
import './ChatProcessor.css';

const ChatProcessor = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.md', '.py', '.js', '.html', '.css', '.json', '.xml', '.yaml', '.yml'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    }
  });

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const startProcessing = async () => {
    if (files.length === 0) {
      showError('请先上传文件');
      return;
    }

    setProcessing(true);
    
    // 更新所有文件状态为处理中
    setFiles(prev => prev.map(f => ({ ...f, status: 'processing' })));

    // 模拟AI处理过程
    for (let i = 0; i < files.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 更新文件状态为完成
      setFiles(prev => prev.map((f, index) => 
        index === i ? { ...f, status: 'completed' } : f
      ));

      // 生成模拟结果
      const result = {
        id: Date.now() + Math.random(),
        fileName: files[i].name,
        summary: `这是对文件 ${files[i].name} 的AI分析总结...`,
        timestamp: new Date().toLocaleString()
      };
      
      setResults(prev => [...prev, result]);
    }

    setProcessing(false);
    showSuccess('所有文件处理完成！');
  };

  return (
    <div className="chat-processor-container">
      {/* 主内容区域 - 三列布局 */}
      <div className="main-content">
        {/* 左侧：上传文件 */}
        <div className="upload-section">
          <Header as="h3" className="section-title">
            上传文件
          </Header>
          
          <div
            {...getRootProps({ className: 'dropzone' })}
            className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
          >
            <input {...getInputProps()} />
            <Icon name="cloud upload" size="huge" className="upload-icon" />
            <Header as="h4" className="dropzone-text">
              {isDragActive ? '释放文件以上传' : '拖放文件到此处或粘贴剪切板内容'}
            </Header>
            <p className="dropzone-description">
              支持50+种文件格式：文档、代码、配置、数据文件等
            </p>
            <Button className="browse-button">
              <Icon name="folder open" />
              浏览文件
            </Button>
          </div>

          {/* 已上传文件列表 */}
          {files.length > 0 && (
            <div className="file-list">
              <Header as="h4">已上传文件 ({files.length})</Header>
              <List divided>
                {files.map((file) => (
                  <List.Item key={file.id} className="file-item">
                    <div className="file-info">
                      <Icon name="file" />
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <div className="file-actions">
                      {file.status === 'pending' && <Icon name="clock outline" color="yellow" />}
                      {file.status === 'processing' && <Icon name="spinner" loading color="blue" />}
                      {file.status === 'completed' && <Icon name="check circle" color="green" />}
                      <Button 
                        size="mini" 
                        negative 
                        icon 
                        onClick={() => removeFile(file.id)}
                        className="delete-button"
                      >
                        <Icon name="trash" />
                      </Button>
                    </div>
                  </List.Item>
                ))}
              </List>
            </div>
          )}
        </div>

        {/* 中间：Specs获取 */}
        <div className="specs-section">
          <Header as="h3" className="section-title">
            Specs获取
          </Header>
          <div className="specs-content">
            <Icon name="sparkles" size="huge" className="specs-icon" />
            <p className="specs-description">
              点击开始处理文件，AI将为您生成总结和分析
            </p>
            <Button 
              primary 
              size="large" 
              onClick={startProcessing}
              disabled={files.length === 0 || processing}
              loading={processing}
              className="process-button"
            >
              {processing ? '处理中...' : '开始处理'}
            </Button>
          </div>
        </div>

        {/* 右侧：结果展示 */}
        <div className="results-section">
          <Header as="h3" className="section-title">
            处理结果
          </Header>
          <div className="results-content">
            {results.length === 0 ? (
              <div className="empty-results">
                <Icon name="file text outline" size="huge" className="empty-icon" />
                <p className="empty-text">处理完成后，结果将在这里显示</p>
              </div>
            ) : (
              <div className="results-list">
                {results.map((result) => (
                  <Card key={result.id} className="result-card">
                    <Card.Content>
                      <Card.Header>{result.fileName}</Card.Header>
                      <Card.Meta>处理完成</Card.Meta>
                      <Card.Description>
                        {result.summary}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <small className="result-timestamp">{result.timestamp}</small>
                    </Card.Content>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatProcessor;
