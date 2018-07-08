import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import AppContainer from './AppContainer';

configure({ adapter: new Adapter() });

const wrapper = shallow(<AppContainer />);

describe('(Component) App', () => {
  it('Should render', () => {
    expect(wrapper).to.have.length(1);
  });
});
