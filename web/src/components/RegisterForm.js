import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
  Icon,
} from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import { API, showError, showInfo, showSuccess } from '../helpers';
import Turnstile from 'react-turnstile';
import './RegisterForm.css';

const RegisterForm = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
    verification_code: '',
  });
  const { username, password, password2 } = inputs;
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setShowEmailVerification(status.email_verification);
      if (status.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(status.turnstile_site_key);
      }
    }
  });

  let navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    console.log(name, value);
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    if (password.length < 8) {
      showInfo('密码长度不得小于 8 位！');
      return;
    }
    if (password !== password2) {
      showInfo('两次输入的密码不一致');
      return;
    }
    if (username && password) {
      if (turnstileEnabled && turnstileToken === '') {
        showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
        return;
      }
      setLoading(true);
      const res = await API.post(
        `/api/user/register?turnstile=${turnstileToken}`,
        inputs
      );
      const { success, message } = res.data;
      if (success) {
        navigate('/login');
        showSuccess('注册成功！');
      } else {
        showError(message);
      }
      setLoading(false);
    }
  }

  const sendVerificationCode = async () => {
    if (inputs.email === '') return;
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    setLoading(true);
    const res = await API.get(
      `/api/verification?email=${inputs.email}&turnstile=${turnstileToken}`
    );
    const { success, message } = res.data;
    if (success) {
      showSuccess('验证码发送成功，请检查你的邮箱！');
    } else {
      showError(message);
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo-container">
            <div className="logo-icon">
              <Icon name="code" size="huge" />
            </div>
            <div className="logo-text">
              <h1 className="logo-title">AnySpecs</h1>
              <span className="logo-subtitle">新用户注册</span>
            </div>
          </div>
        </div>

        <div className="register-form">
          <Form size="large">
            <div className="form-group">
              <div className="input-wrapper">
                <Icon name="user" className="input-icon" />
                <Form.Input
                  fluid
                  placeholder="输入用户名，最长 12 位"
                  onChange={handleChange}
                  name="username"
                  className="modern-input"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <Icon name="lock" className="input-icon" />
                <Form.Input
                  fluid
                  placeholder="输入密码，最短 8 位，最长 20 位"
                  onChange={handleChange}
                  name="password"
                  type="password"
                  className="modern-input"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <Icon name="lock" className="input-icon" />
                <Form.Input
                  fluid
                  placeholder="确认密码，最短 8 位，最长 20 位"
                  onChange={handleChange}
                  name="password2"
                  type="password"
                  className="modern-input"
                />
              </div>
            </div>

            {showEmailVerification && (
              <>
                <div className="form-group">
                  <div className="input-wrapper">
                    <Icon name="mail" className="input-icon" />
                    <Form.Input
                      fluid
                      placeholder="输入邮箱地址"
                      onChange={handleChange}
                      name="email"
                      type="email"
                      className="modern-input"
                    />
                  </div>
                  <Button 
                    onClick={sendVerificationCode} 
                    disabled={loading}
                    className="verification-btn"
                    size="small"
                  >
                    <Icon name="send" />
                    获取验证码
                  </Button>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <Icon name="key" className="input-icon" />
                    <Form.Input
                      fluid
                      placeholder="输入验证码"
                      onChange={handleChange}
                      name="verification_code"
                      className="modern-input"
                    />
                  </div>
                </div>
              </>
            )}

            {turnstileEnabled && (
              <div className="turnstile-container">
                <Turnstile
                  sitekey={turnstileSiteKey}
                  onVerify={(token) => {
                    setTurnstileToken(token);
                  }}
                />
              </div>
            )}

            <Button
              color=""
              fluid
              size="large"
              onClick={handleSubmit}
              loading={loading}
              className="register-button"
            >
              <Icon name="user plus" />
              注册
            </Button>
          </Form>
        </div>

        <div className="register-footer">
          <div className="footer-links">
            <span className="footer-text">已有账户？</span>
            <Link to="/login" className="footer-link">
              点击登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
