import { expect } from 'chai';

import Request from './request';

describe('Request', () => {
  var fakePositiveRequestObject = {
    query: {
      context: true,
      domain: true,
      status: true,
    },
  };

  var fakeNegativeRequestObject = {
    query: {
      context: null,
      domain: null,
      status: true,
    },
  };

  it('Should return an object containing all three defined keys',()=>{
  	let r = new Request();
  	let returnedQuery = r.getQuery(fakePositiveRequestObject);
  	expect(returnedQuery).to.deep.equal(fakePositiveRequestObject.query);
  });

  it('Should return an object containing only the defined key',()=>{
  	let r = new Request();
  	let returnedQuery = r.getQuery(fakeNegativeRequestObject);
  	expect(returnedQuery).to.have.property('status',true);
    expect(returnedQuery).to.not.have.keys('context','domain');
  });

});