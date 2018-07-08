import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import ScannerInput from './ScannerInput';

const plainFunc = () => {};

configure({ adapter: new Adapter() });

const wrapper = mount(<ScannerInput handleInputChange={plainFunc} resetInputResult={plainFunc} />);

describe('(Component) ScannerInput', () => {
  it('Should render an input', () => {
    expect(wrapper.find("input")).to.have.length(1);
  });

  it('Should render text type input', () => {
    expect(wrapper.find("input").props().type).to.equal('text');
  });
});
