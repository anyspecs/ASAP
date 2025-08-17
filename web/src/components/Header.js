import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';

import {
  Button,
  Container,
  Dropdown,
  Icon,
  Menu,
  Segment,
} from 'semantic-ui-react';
import { API, getSystemName, isAdmin, isMobile, showSuccess } from '../helpers';
import '../index.css';
import './Header.css';

// Header Buttons
const headerButtons = [
  {
    name: '首页',
    to: '/',
    icon: 'home',
  },
  {
    name: '文件',
    to: '/file',
    icon: 'file',
  },
  {
    name: '聊天处理',
    to: '/chat',
    icon: 'chat',
  },
  {
    name: '用户',
    to: '/user',
    icon: 'user',
    admin: true,
  },
  {
    name: '设置',
    to: '/setting',
    icon: 'setting',
  },
  {
    name: '关于',
    to: '/about',
    icon: 'info circle',
  },
];

const Header = () => {
  const [userState, userDispatch] = useContext(UserContext);
  let navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);
  const systemName = getSystemName();

  async function logout() {
    setShowSidebar(false);
    await API.get('/api/user/logout');
    showSuccess('注销成功!');
    userDispatch({ type: 'logout' });
    localStorage.removeItem('user');
    navigate('/login');
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const renderButtons = (isMobile) => {
    return headerButtons.map((button) => {
      if (button.admin && !isAdmin()) return <></>;
      if (isMobile) {
        return (
          <Menu.Item
            key={button.name}
            onClick={() => {
              navigate(button.to);
              setShowSidebar(false);
            }}
            className="mobile-nav-item"
          >
            <Icon name={button.icon} />
            {button.name}
          </Menu.Item>
        );
      }
      return (
        <Menu.Item key={button.name} as={Link} to={button.to} className="nav-item">
          <Icon name={button.icon} />
          {button.name}
        </Menu.Item>
      );
    });
  };

  if (isMobile()) {
    return (
      <header className="mobile-header">
        <div className="mobile-header-content">
          <div className="mobile-header-left">
            <Menu.Item as={Link} to='/' className="logo-item">
              <div className="logo-container">
                <div className="logo-icon">
                  <Icon name="code" size="large" />
                </div>
                <div className="logo-text">
                  <span className="logo-title">{systemName}</span>
                  <span className="logo-beta">Beta</span>
                </div>
              </div>
            </Menu.Item>
          </div>
          <div className="mobile-header-right">
            <Button
              icon={showSidebar ? 'close' : 'sidebar'}
              basic
              circular
              onClick={toggleSidebar}
              className="mobile-menu-toggle"
            />
          </div>
        </div>
        
        {showSidebar && (
          <div className="mobile-sidebar">
            <div className="sidebar-nav">
              {renderButtons(true)}
              <div className="sidebar-auth">
                {userState.user ? (
                  <Button 
                    onClick={logout}
                    className="auth-btn logout-btn"
                    fluid
                  >
                    <Icon name="sign-out" />
                    注销
                  </Button>
                ) : (
                  <div className="auth-buttons">
                    <Button
                      onClick={() => {
                        setShowSidebar(false);
                        navigate('/login');
                      }}
                      className="auth-btn login-btn"
                      fluid
                    >
                      <Icon name="sign-in" />
                      登录
                    </Button>
                    <Button
                      onClick={() => {
                        setShowSidebar(false);
                        navigate('/register');
                      }}
                      className="auth-btn register-btn"
                      fluid
                    >
                      <Icon name="user plus" />
                      注册
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className="desktop-header">
      <div className="header-container">
        <div className="header-left">
          <Menu.Item as={Link} to='/' className="logo-item">
            <div className="logo-container">
              <div className="logo-icon">
                <Icon name="code" size="large" />
              </div>
              <div className="logo-text">
                <span className="logo-title">{systemName}</span>
                <span className="logo-beta">Beta</span>
              </div>
            </div>
          </Menu.Item>
          
          <nav className="header-nav">
            {renderButtons(false)}
          </nav>
        </div>
        
        <div className="header-right">
          {userState.user ? (
            <Dropdown
              text={userState.user.username}
              pointing
              className='user-dropdown'
            >
              <Dropdown.Menu className="user-dropdown-menu">
                <Dropdown.Item onClick={logout} className="dropdown-item">
                  <Icon name="sign-out" />
                  注销
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <div className="auth-buttons">
              <Button
                name='登录'
                as={Link}
                to='/login'
                className='auth-btn login-btn'
                basic
              >
                <Icon name="sign-in" />
                登录
              </Button>
              <Button
                name='注册'
                as={Link}
                to='/register'
                className='auth-btn register-btn'
                primary
              >
                <Icon name="user plus" />
                注册
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
