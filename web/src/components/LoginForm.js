import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Modal,
  Segment,
  Icon,
} from 'semantic-ui-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/User';
import { API, showError, showSuccess } from '../helpers';
import './LoginForm.css';

const LoginForm = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    wechat_verification_code: '',
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const { username, password } = inputs;
  const [userState, userDispatch] = useContext(UserContext);
  let navigate = useNavigate();

  const [status, setStatus] = useState({});

  useEffect(() => {
    if (searchParams.get("expired")) {
      showError('未登录或登录已过期，请重新登录！');
    }
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setStatus(status);
    }
  }, []);

  const [showWeChatLoginModal, setShowWeChatLoginModal] = useState(false);

  const onGitHubOAuthClicked = () => {
    window.open(
      `https://github.com/login/oauth/authorize?client_id=${status.github_client_id}&scope=user:email`
    );
  };

  const onWeChatLoginClicked = () => {
    setShowWeChatLoginModal(true);
  };

  const onSubmitWeChatVerificationCode = async () => {
    const res = await API.get(
      `/api/oauth/wechat?code=${inputs.wechat_verification_code}`
    );
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/');
      showSuccess('登录成功！');
      setShowWeChatLoginModal(false);
    } else {
      showError(message);
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    setSubmitted(true);
    if (username && password) {
      const res = await API.post('/api/user/login', {
        username,
        password,
      });
      const { success, message, data } = res.data;
      if (success) {
        userDispatch({ type: 'login', payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/');
        showSuccess('登录成功！');
      } else {
        showError(message);
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">
              <img src="/logo.png" alt="Logo" className="custom-logo" />
            </div>
            <div className="logo-text">
              <h1 className="logo-title">AnySpecs</h1>
              <span className="logo-subtitle">用户登录</span>
            </div>
          </div>
        </div>

        <div className="login-form">
          <Form size="large">
            <div className="form-group">
              <div className="input-wrapper">
                <Icon name="user" className="input-icon" />
                <Form.Input
                  fluid
                  placeholder="用户名"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  className="modern-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-wrapper">
                <Icon name="lock" className="input-icon" />
                <Form.Input
                  fluid
                  placeholder="密码"
                  name="password"
                  type="password"
                  value={password}
                  onChange={handleChange}
                  className="modern-input"
                />
              </div>
            </div>

            <Button 
              color="" 
              fluid 
              size="large" 
              onClick={handleSubmit}
              className="login-button"
            >
              <Icon name="sign-in" />
              登录
            </Button>
          </Form>
        </div>

        <div className="login-footer">
          <div className="footer-links">
            <Link to="/reset" className="footer-link">
              忘记密码？
            </Link>
            <span className="footer-separator">•</span>
            <Link to="/register" className="footer-link">
              没有账户？点击注册
            </Link>
          </div>
        </div>

        {(status.github_oauth || status.wechat_login) && (
          <div className="social-login">
            <Divider horizontal className="social-divider">
              <span className="divider-text">或使用以下方式登录</span>
            </Divider>
            
            <div className="social-buttons">
              {status.github_oauth && (
                <Button
                  circular
                  size="large"
                  className="social-btn github-btn"
                  onClick={onGitHubOAuthClicked}
                >
                  <Icon name="github" />
                </Button>
              )}
              
              {status.wechat_login && (
                <Button
                  circular
                  size="large"
                  className="social-btn wechat-btn"
                  onClick={onWeChatLoginClicked}
                >
                  <Icon name="wechat" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* WeChat Login Modal */}
      <Modal
        onClose={() => setShowWeChatLoginModal(false)}
        onOpen={() => setShowWeChatLoginModal(true)}
        open={showWeChatLoginModal}
        size={'mini'}
        className="wechat-modal"
      >
        <Modal.Content className="modal-content">
          <Modal.Description>
            <div className="wechat-content">
              <div className="qr-code-container">
                <Image src={status.wechat_qrcode} fluid className="qr-code" />
              </div>
              <div className="wechat-instructions">
                <p className="instruction-text">
                  微信扫码关注公众号，输入「验证码」获取验证码（三分钟内有效）
                </p>
              </div>
              <Form size="large" className="wechat-form">
                <div className="input-wrapper">
                  <Icon name="key" className="input-icon" />
                  <Form.Input
                    fluid
                    placeholder="验证码"
                    name="wechat_verification_code"
                    value={inputs.wechat_verification_code}
                    onChange={handleChange}
                    className="modern-input"
                  />
                </div>
                <Button
                  color=""
                  fluid
                  size="large"
                  onClick={onSubmitWeChatVerificationCode}
                  className="wechat-login-btn"
                >
                  <Icon name="wechat" />
                  微信登录
                </Button>
              </Form>
            </div>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default LoginForm;
