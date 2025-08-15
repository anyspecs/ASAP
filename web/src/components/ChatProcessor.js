import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Header,
  Segment,
  Button,
  Icon,
  Progress,
  Grid,
  Card,
  List,
  Divider
} from 'semantic-ui-react';
import { showSuccess, showError } from '../helpers';
import './ChatProcessor.css';

const ChatProcessor = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setCurrentStep(1);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.md', '.log'],
      'application/json': ['.json'],
      'application/xml': ['.xml'],
      'text/plain': ['.txt', '.log', '.md']
    },
    multiple: true
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
    setCurrentStep(2);

    try {
      // 模拟AI处理过程
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 更新文件状态为处理中
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'processing' } : f
        ));

        // 模拟处理延迟
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 模拟处理结果
        const result = {
          id: file.id,
          fileName: file.name,
          summary: `这是对 ${file.name} 的AI分析总结。文件包含聊天记录数据，AI已识别出主要对话主题、关键信息点和重要时间节点。`,
          analysis: {
            totalMessages: Math.floor(Math.random() * 1000) + 100,
            participants: Math.floor(Math.random() * 10) + 2,
            keyTopics: ['项目讨论', '技术交流', '会议安排', '问题解决'],
            sentiment: 'positive',
            timeRange: '2024-01-01 至 2024-12-31'
          },
          insights: [
            '识别出3个主要讨论主题',
            '发现5个关键决策点',
            '检测到2个需要关注的问题',
            '总结出项目进展时间线'
          ]
        };

        setResults(prev => [...prev, result]);
        
        // 更新文件状态为完成
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'completed' } : f
        ));
      }

      setCurrentStep(3);
      showSuccess('所有文件处理完成！');
    } catch (error) {
      showError('处理过程中出现错误：' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const downloadResult = (result) => {
    const content = `
聊天记录分析报告
================

文件名: ${result.fileName}
处理时间: ${new Date().toLocaleString()}

总结:
${result.summary}

分析结果:
- 总消息数: ${result.analysis.totalMessages}
- 参与者数: ${result.analysis.participants}
- 主要主题: ${result.analysis.keyTopics.join(', ')}
- 情感倾向: ${result.analysis.sentiment}
- 时间范围: ${result.analysis.timeRange}

关键洞察:
${result.insights.map(insight => `- ${insight}`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.fileName}_分析报告.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="chat-processor-container">
      {/* 顶部进度指示器 */}
      <div className="progress-section">
        <Progress 
          value={currentStep} 
          total={3} 
          size="large" 
          color="blue"
          className="main-progress"
        />
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <Icon name="arrow up" size="large" />
            <span>上传文件</span>
          </div>
          <Icon name="arrow right" size="large" className="step-arrow" />
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <Icon name="sparkles" size="large" />
            <span>AI处理</span>
          </div>
          <Icon name="arrow right" size="large" className="step-arrow" />
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <Icon name="check circle" size="large" />
            <span>完成</span>
          </div>
        </div>
      </div>

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
              <Icon name="sparkles" />
              开始处理 →
            </Button>
          </div>
        </div>

        {/* 右侧：处理结果 */}
        <div className="results-section">
          <Header as="h3" className="section-title">
            处理结果
          </Header>
          
          {results.length === 0 ? (
            <div className="empty-results">
              <Icon name="file text outline" size="huge" className="empty-icon" />
              <p className="empty-text">处理完成后，结果将在这里显示</p>
            </div>
          ) : (
            <div className="results-content">
              {results.map((result) => (
                <Card key={result.id} fluid className="result-card">
                  <Card.Content>
                    <Card.Header className="result-header">
                      <Icon name="file text" />
                      {result.fileName}
                    </Card.Header>
                    <Card.Meta>处理完成</Card.Meta>
                    <Card.Description className="result-description">
                      <p><strong>总结：</strong>{result.summary}</p>
                      
                      <Divider />
                      
                      <div className="analysis-grid">
                        <div className="analysis-item">
                          <strong>总消息数：</strong> {result.analysis.totalMessages}
                        </div>
                        <div className="analysis-item">
                          <strong>参与者数：</strong> {result.analysis.participants}
                        </div>
                        <div className="analysis-item">
                          <strong>情感倾向：</strong> 
                          <span className={`sentiment ${result.analysis.sentiment}`}>
                            {result.analysis.sentiment === 'positive' ? '积极' : 
                             result.analysis.sentiment === 'negative' ? '消极' : '中性'}
                          </span>
                        </div>
                        <div className="analysis-item">
                          <strong>时间范围：</strong> {result.analysis.timeRange}
                        </div>
                      </div>

                      <Divider />
                      
                      <div className="insights-section">
                        <strong>关键洞察：</strong>
                        <List bulleted className="insights-list">
                          {result.insights.map((insight, index) => (
                            <List.Item key={index}>{insight}</List.Item>
                          ))}
                        </List>
                      </div>
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Button 
                      primary 
                      fluid 
                      onClick={() => downloadResult(result)}
                      className="download-button"
                    >
                      <Icon name="download" />
                      下载分析报告
                    </Button>
                  </Card.Content>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatProcessor;
