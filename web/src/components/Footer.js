import React from 'react';
import { Icon } from 'semantic-ui-react';
import { getFooterHTML, getSystemName } from '../helpers';
import './Footer.css';

const Footer = () => {
  const systemName = getSystemName();
  const footer = getFooterHTML();

  return (
    <footer className="modern-footer">
      <div className="footer-container">
        {footer ? (
          <div
            className='custom-footer'
            dangerouslySetInnerHTML={{ __html: footer }}
          ></div>
        ) : (
          <div className='footer-default'>
            <div className="footer-content">
              <div className="footer-copyright">
                © 2025 {systemName} · v0.1.0
              </div>
              
              <div className="footer-links">
                <a href="#" className="footer-link">
                  <Icon name="file text" />
                  服务条款
                </a>
                <a href="#" className="footer-link">
                  <Icon name="shield" />
                  隐私政策
                </a>
                <a href="#" className="footer-link">
                  <Icon name="mail" />
                  联系我们
                </a>
                <a
                  href='https://github.com/anyspecs'
                  target='_blank'
                  rel='noopener noreferrer'
                  className="footer-link"
                >
                  <Icon name="github" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
