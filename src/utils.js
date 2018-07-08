const isValidBarcode = value =>
  /^[0-9]*$/.test(value);

const isCharCodeNumerical = value =>
  /[0-9]/i.test(String.fromCharCode(value));

const isEnterKey = (value) => {
  const enterArr = [13, 'enter'];
  const isValueEnter = enterArr.indexOf(value) > -1;
  return isValueEnter;
};

const getAuthToken = () => window.localStorage.getItem('m-token');

export {
  isValidBarcode,
  isCharCodeNumerical,
  isEnterKey,
  getAuthToken,
};
