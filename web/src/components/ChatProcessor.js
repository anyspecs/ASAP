import React, { useState, useCallback, useMemo } from 'react';
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
import { API } from '../helpers';
import { authHeader } from '../helpers/auth-header';
import './ChatProcessor.css';

const ChatProcessor = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);

  // 后端代理已持有密钥，前端无需校验

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      blob: file,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setFinished(false);
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

  // 上传到 Dify Files API
  async function uploadToDify(fileObj) {
    const file = fileObj.blob;
    const original = fileObj.name || file.name;
    const clean = original.replace(/[:<>"|?*]/g, '_');
    const ext = (clean.split('.').pop() || '').toLowerCase();
    let fileType = 'TXT';
    let mime = 'text/plain';
    if (ext === 'pdf') { fileType = 'PDF'; mime = 'application/pdf'; }

    const form = new FormData();
    form.append('file', file, clean);
    form.append('user', 'chat-user');
    form.append('type', fileType);

    // 通过后端代理，避免在前端暴露 Token
    const resp = await fetch(`/api/dify/files/upload`, { method: 'POST', body: form });
    if (resp.status !== 201) {
      const txt = await resp.text();
      throw new Error(`上传失败(${resp.status}): ${txt}`);
    }
    const data = await resp.json();
    return data.id;
  }

  // 运行 Dify Workflow
  async function runWorkflow(fileId) {
    const payload = {
      inputs: {
        files: {
          transfer_method: 'local_file',
          upload_file_id: fileId,
          type: 'document',
        },
      },
      response_mode: 'blocking',
      user: 'chat-user',
    };
    const resp = await fetch(`/api/dify/workflows/run`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (resp.status !== 200) {
      const txt = await resp.text();
      throw new Error(`workflow失败(${resp.status}): ${txt}`);
    }
    const data = await resp.json();
    return data;
  }

  const startProcessing = async () => {
    if (files.length === 0) {
      showError('请先选择文件');
      return;
    }
    setProcessing(true);
    setFiles(prev => prev.map(f => ({ ...f, status: 'processing' })));

    for (let idx = 0; idx < files.length; idx++) {
      const f = files[idx];
      try {
        const fileId = await uploadToDify(f);
        const wf = await runWorkflow(fileId);
        const outputs = (wf?.data?.outputs) || {};
        const result = {
          id: Date.now() + Math.random(),
          fileName: f.name,
          outputs,
          timestamp: new Date().toLocaleString(),
        };
        setResults(prev => [result, ...prev]);
        setFiles(prev => prev.map((x) => (x.id === f.id ? { ...x, status: 'completed' } : x)));
      } catch (e) {
        showError(`${f.name} 处理失败: ${e.message}`);
        setFiles(prev => prev.map((x) => (x.id === f.id ? { ...x, status: 'failed' } : x)));
      }
    }
    setProcessing(false);
    setFinished(true);
    showSuccess('处理完成');
  };

  // 组装可下载/上传的文本内容
  function buildResultText() {
    if (!results || results.length === 0) return '';
    const sections = results.map(r => {
      const code = r.outputs?.output_code || '';
      const chat = r.outputs?.output_chat || '';
      let s = `# ${r.fileName}\n\n`;
      if (chat) s += `${chat}\n\n`;
      if (code) s += '```\n' + code + '\n```\n\n';
      return s;
    });
    return sections.join('\n---\n\n');
  }

  function getDownloadName() {
    if (results && results.length === 1) {
      const base = results[0].fileName.replace(/\.[^.]+$/, '');
      return `${base}.md`;
    }
    return `processed_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.md`;
  }

  const handleDownload = () => {
    const content = buildResultText();
    const filename = getDownloadName();
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleUpload = async () => {
    try {
      const content = buildResultText();
      if (!content) { showError('暂无可上传的处理结果'); return; }
      const filename = getDownloadName();
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const file = new File([blob], filename, { type: 'text/markdown' });
      const form = new FormData();
      form.append('file', file);
      const res = await API.post(`/api/file`, form, {
        headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
      });
      const { success, message } = res.data;
      if (success) showSuccess('结果已上传到文件库'); else showError(message || '上传失败');
    } catch (e) {
      showError(e.message || '上传失败');
    }
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
              支持多种文件格式：markdown，json，html 等
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
              disabled={files.length === 0 || processing || finished}
              loading={processing}
              className="process-button"
            >
              {processing ? '处理中...' : '开始处理'}
            </Button>
            {finished && (
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <Button basic onClick={handleDownload} icon labelPosition='left'>
                  <Icon name='download' /> 下载处理结果
                </Button>
                <Button basic color='blue' onClick={handleUpload} icon labelPosition='left'>
                  <Icon name='cloud upload' /> 上传到文件库
                </Button>
              </div>
            )}
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
                {results.map((result) => {
                  const code = result.outputs?.output_code;
                  const chat = result.outputs?.output_chat;
                  return (
                    <Card key={result.id} className="result-card">
                      <Card.Content>
                        <Card.Header>{result.fileName}</Card.Header>
                        <Card.Meta>处理完成</Card.Meta>
                        <Card.Description>
                          {chat && (<div style={{ whiteSpace: 'pre-wrap', marginBottom: 12 }}>{chat}</div>)}
                          {code && (
                            <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, overflowX: 'auto' }}>
                              {code}
                            </pre>
                          )}
                          {!chat && !code && (
                            <div style={{ color: '#777' }}>无输出</div>
                          )}
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <small className="result-timestamp">{result.timestamp}</small>
                      </Card.Content>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatProcessor;
