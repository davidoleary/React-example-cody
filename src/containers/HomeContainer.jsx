import React, { Component } from 'react';
import { Button, Grid, Icon, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import 'isomorphic-fetch';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import ScannerInput from '../components/ScannerInput/ScannerInput';
import { isCharCodeNumerical, isValidBarcode } from '../utils';
import ButtonLink from '../components/ButtonLink/ButtonLink';
import config from '../config/default';
import shareDriveLink from './../share-drive-link';

class HomeContainer extends Component {
  static buildPath(data) {
    return `DESIGNERS/${data.Division_Code}/${data.Season_Code}/${data.Brand_Code}/` +
      `${data.Brand_Code}_${data.Season_Code}_${data.Colour_Code}_${data.Item_No}`;
  }

  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      barcode: {},
      barcodeValue: '',
      history: [],
      keyExists: false,
      showPathSuccess: false,
      copiedToClipBoard: true,
    };

    this.errorTypes = {
      getBarcodeDataError: 'Error getting barcode data',
      createPathError: 'Error creating path',
    };
  }

  componentDidMount() {
    let barcode = '';

    document.addEventListener('keydown', (event) => {
      // get the current barcode
      // this is so the input field and the app state mirror each other
      barcode = this.state.barcodeValue;

      const keyCode = event.keyCode;

      // only if the keydown is not from the input field
      // do you need to manually add it to the barcode and update the app state
      // (this is so you can use the barcode scanner without being focused on the input field)

      if (event.target.nodeName.toLowerCase() !== 'input') {
        if (isCharCodeNumerical(keyCode)) {
          barcode += event.key;
        }

        this.handleInputChange({
          target: {
            value: barcode,
          },
        });
      }
    });
  }

  setHistory(barcode) {
    const history = this.state.history.slice();
    if (history.indexOf(barcode) === -1) {
      history.push(barcode);
      this.setState({ history });
    }
  }

  /**
   * Fetch barcode data from API endpoint
   * @param {integer} barcode
   * @returns {Promise.<void>}
   */
  fetchBarcode = async (barcode) => {
    if (barcode) {
      try {
        const response = await fetch(`${config.api.host}${config.api.barcodeEndpoint}${barcode}`, {
          headers: {
            'X-ACCESS-TOKEN': localStorage.getItem('m-token'),
          },
        });
        const data = await response.json();

        if (!response.ok) {
          data.content.error.type = this.errorTypes.getBarcodeDataError;
          data.content.error.status = response.status;

          this.setState({
            error: data.content.error,
          });

          return;
        }

        const pathExists = await this.fetchPathExists(data);

        if (data) {
          this.setState({
            pathExists,
            barcode: data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  fetchPathExists = async (data) => {
    try {
      const pathData = data.content.barcode[0];
      const response = await fetch(`${config.api.host}${config.api.pathEndpoint}?key=${HomeContainer.buildPath(pathData)}`, {
        headers: {
          'X-ACCESS-TOKEN': localStorage.getItem('m-token'),
        },
      });
      return response.status === 200;
    } catch (e) {
      return console.log(e);
    }
  };

  fetchCreatePath = async (key) => {
    try {
      const response = await fetch(`${config.api.host}${config.api.pathEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-ACCESS-TOKEN': localStorage.getItem('m-token'),
        },
        body: JSON.stringify({ key }),
      });

      const data = await response.json();

      if (!response.ok) {
        data.content.error.type = this.errorTypes.createPathError;
        data.content.error.status = response.status;

        this.setState({
          error: data.content.error,
        });

        return;
      }

      if (data) {
        this.setState({
          pathExists: true,
          showPathSuccess: true,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  clearBarcodeValue() {
    this.setState({
      barcodeValue: '',
    });
  }

  /**
   * Handle input
   * @param event
   */
  handleInputChange = (event) => {
    const barcode = event.target.value.trim();

    this.setState({
      barcodeValue: barcode,
    });

    if (barcode.length !== parseInt(config.barcodeLength, 10)) {
      this.resetInputResult();
    }

    // if the barcode is the required length,
    // is a valid barcode (only numerical)
    // return true
    const shouldFetchBarcode = barcode.length === parseInt(config.barcodeLength, 10)
      && isValidBarcode(barcode);

    if (shouldFetchBarcode) {
      this.setHistory(barcode);
      this.resetInputResult();
      this.fetchBarcode(barcode);
      this.clearBarcodeValue();
    }
  };

  /**
   * Handle button click
   */
  handleButtonClick = () => {
    const data = this.state.barcode.content.barcode[0];
    const path = HomeContainer.buildPath(data);

    this.fetchCreatePath(encodeURI(`${path}/`));
  };

  handleLinkClick = () => {
    const data = this.state.barcode.content.barcode[0];
    const url = shareDriveLink(data);
    window.open(url, 'new link', 'height=200,width=350');
  }

  handleCopyClipboardClick = () => {
    this.setState({ copiedToClipBoard: true });
  }

  resetInputResult = () => {
    if (Object.keys(this.state.barcode).length > 0) {
      this.setState({
        barcode: {},
        showPathSuccess: false,
      });
    }

    this.setState({
      error: {},
    });
  };

  render() {
    let data = {};
    let path = '';
    let error = false;
    const isThereHistory = this.state.history.length > 0;
    let lastBarcode;

    const gridSettings = {
      width: 10,
    };

    if (Object.keys(this.state.barcode).length > 0) {
      data = this.state.barcode.content.barcode[0];
      path = HomeContainer.buildPath(data);
    }

    if (this.state.error && Object.keys(this.state.error).length > 0) {
      error = true;
    }

    if (isThereHistory) {
      const history = this.state.history;
      lastBarcode = history[history.length - 1];
    }

    return (
      <Grid centered verticalAlign="middle" className="page-header">
        <Grid.Row color="black" className="topRow">
          <Grid.Column width={gridSettings.width}>
            Cody - Studio bucket creator
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={gridSettings.width}>
            <ScannerInput
              handleInputChange={this.handleInputChange}
              resetInputResult={this.resetInputResult}
              barcodeValue={this.state.barcodeValue}
            />
          </Grid.Column>
        </Grid.Row>

        {isThereHistory &&
          <Grid.Row>
            <Grid.Column width={gridSettings.width}>
              <Message info content={`Last Barcode scanned: ${lastBarcode}`} />
            </Grid.Column>
          </Grid.Row>
        }

        {data && Object.keys(data).length > 0 &&
          <Grid.Row>
            <Grid.Column width={gridSettings.width}>
              <Message info>
                <Message.Header>Path</Message.Header>
                <p>{path}</p>

                {this.state.pathExists &&
                  <ButtonLink onClick={this.handleLinkClick} size="small" animated>
                    <Button.Content visible>
                      <Icon name="external" />
                    </Button.Content>
                    <Button.Content hidden>Open</Button.Content>
                  </ButtonLink>
                }

                <CopyToClipboard
                  text={path}
                  onClick={this.handleCopyClipboardClick}
                >
                  <Button size="small" animated className="basic">
                    <Button.Content visible>
                      <Icon name="copy" />
                    </Button.Content>
                    <Button.Content hidden>Copy</Button.Content>
                  </Button>
                </CopyToClipboard>
              </Message>
              {!this.state.pathExists &&
                <Button positive size="large" onClick={this.handleButtonClick}>Create</Button>
              }
              {this.state.pathExists && !this.state.showPathSuccess &&
                <Message
                  positive
                  header={'This path already exists'}
                />
              }
            </Grid.Column>
          </Grid.Row>
        }

        {this.state.showPathSuccess &&
          <Grid.Row>
            <Grid.Column width={gridSettings.width}>
              <Message
                success
                header="Path Created Successfully"
              />
            </Grid.Column>
          </Grid.Row>
        }

        {error &&
          <Grid.Row>
            <Grid.Column width={gridSettings.width}>
              <Message
                error
                header={`Error: ${this.state.error.message}`}
                content={`Please contact IT support referencing this error: ${this.state.error.type} - ${this.state.error.status} ${this.state.error.code} `}
              />
            </Grid.Column>
          </Grid.Row>
        }
      </Grid>
    );
  }
}

export default HomeContainer;
