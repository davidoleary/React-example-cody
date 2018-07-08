import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import ButtonLink from './ButtonLink';

configure({ adapter: new Adapter() });

const wrapper = mount(<ButtonLink />);

describe('(Component) ButtonLink', () => {
  it('Should render', () => {
    expect(wrapper).to.have.length(1);
  });
});
