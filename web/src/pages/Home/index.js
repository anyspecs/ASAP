import React, { useContext, useEffect } from 'react';
import { Card, Grid, Header, Segment, Button, Icon } from 'semantic-ui-react';
import { API, showError, showNotice, timestamp2string } from '../../helpers';
import { StatusContext } from '../../context/Status';
import './Home.css';

const Home = () => {
  const [statusState, statusDispatch] = useContext(StatusContext);
  const homePageLink = localStorage.getItem('home_page_link') || '';

  const displayNotice = async () => {
    const res = await API.get('/api/notice');
    const { success, message, data } = res.data;
    if (success) {
      let oldNotice = localStorage.getItem('notice');
      if (data !== oldNotice && data !== '') {
        showNotice(data);
        localStorage.setItem('notice', data);
      }
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    displayNotice().then();
  }, []);

  if (homePageLink !== '') {
    return (
      <iframe
        src={homePageLink}
        style={{ width: '100%', height: '100vh', border: 'none' }}
      />
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            把复杂 <span className="portrait-break"><br /></span> 化为可复用的规范
          </h1>
          <p className="hero-subtitle">
            将对话、文档与上下文一键提炼成 .specs / .parse，让团队与模型在任意环境继续无缝协作。
          </p>
          <div className="hero-actions">
            <Button size="large" primary className="hero-btn-primary">
              开始体验
            </Button>
            <Button size="large" basic className="hero-btn-secondary">
              浏览模板
            </Button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="demo-card">
            <div className="demo-header">
              <span className="demo-dot red"></span>
              <span className="demo-dot yellow"></span>
              <span className="demo-dot green"></span>
              <div className="demo-time">Demo • 00:42</div>
            </div>
            <div className="demo-content">
              <div className="demo-placeholder">
                <Icon name="code" size="huge" />
                <p>交互式演示</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="about-section">
        <div className="section-card">
          <h3 className="section-title">关于 AnySpecs</h3>
          <p className="section-description">
            AnySpecs 是面向"上下文工程"的统一规范与工具链。我们将对话与文档压缩为可复用的 <code>.specs</code> / <code>.parse</code>，以结构化方式在团队、模型与项目之间顺畅迁移与延续。
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Icon name="magic" size="large" />
              </div>
              <div className="feature-title">一键处理</div>
              <div className="feature-description">自动提取目标、约束与关键信息，形成标准化规范。</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Icon name="copy" size="large" />
              </div>
              <div className="feature-title">可复用模板</div>
              <div className="feature-description">发布到广场，沉淀可共享的上下文模板并支持二次创作。</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Icon name="lock" size="large" />
              </div>
              <div className="feature-title">私有/公开可控</div>
              <div className="feature-description">私有库仅自己可见，可按需开启「允许他人发现」。</div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <div className="how-to-section">
        <h3 className="section-title">如何使用</h3>
        <div className="steps-container">
          <div className="steps-visual">
            <div className="video-placeholder">
              <Icon name="play" size="huge" />
            </div>
            <p className="video-caption">按步骤完成：登录 → 上传原文件 → 生成规范 → 导出/发布到广场。</p>
          </div>
          <div className="steps-list">
            <div className="step-item">
              <span className="step-number">1</span>
              <span className="step-text">登录并同意协议</span>
            </div>
            <div className="step-item">
              <span className="step-number">2</span>
              <span className="step-text">上传原始文件</span>
            </div>
            <div className="step-item">
              <span className="step-number">3</span>
              <span className="step-text">一键生成规范</span>
            </div>
            <div className="step-item">
              <span className="step-number">4</span>
              <span className="step-text">导出或发布到广场</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
