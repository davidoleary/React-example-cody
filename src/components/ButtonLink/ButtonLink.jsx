import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const ButtonLink = ({
  className = '',
  ...props
}) => (
  <Button
    basic
    className={['link', className].join(' ')}
    {...props}
  />
);

ButtonLink.defaultProps = {
  className: '',
};

ButtonLink.propTypes = {
  className: PropTypes.string,
};

export default ButtonLink;
