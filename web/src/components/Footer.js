import React from 'react';

import { Container, Segment } from 'semantic-ui-react';
import { getFooterHTML, getSystemName } from '../helpers';

const Footer = () => {
  const systemName = getSystemName();
  const footer = getFooterHTML();

  return (
    <Segment vertical>
      <Container textAlign='center'>
        {footer ? (
          <div
            className='custom-footer'
            dangerouslySetInnerHTML={{ __html: footer }}
          ></div>
        ) : (
          <div className='custom-footer'>
            <a
              href='https://github.com/anyspecs'
              target='_blank'
              rel='noopener noreferrer'
            >
              © 2025 AnySpecs
            </a>
          </div>
        )}
      </Container>
    </Segment>
  );
};

export default Footer;
