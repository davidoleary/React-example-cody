import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import HomeContainer from './HomeContainer';

configure({ adapter: new Adapter() });

const wrapper = mount(<HomeContainer />);

describe('(Component) HomeContainer', () => {
  it('Should render', () => {
    expect(wrapper).to.have.length(1);
  });
});
