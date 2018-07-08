import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import config from '../../config/default';

const ScannerInput = props =>
  (<Input
    action={{ icon: 'barcode' }}
    actionPosition="left"
    type="text"
    size="large"
    placeholder="barcode"
    value={props.barcodeValue}
    onChange={props.handleInputChange}
    maxLength={config.barcodeLength}
  />);

ScannerInput.defaultProps = {
  barcodeValue: '',
};

ScannerInput.propTypes = {
  barcodeValue: PropTypes.string,
  handleInputChange: PropTypes.func.isRequired,
};

export default ScannerInput;
