import React from 'react';
import { expect } from 'chai';
import TestRenderer from 'react-test-renderer';
import ResolvedRoute from '../src/ResolvedRoute';

describe('ResolvedRoute', () => {
  it('is a component', () => {
    expect(TestRenderer.create(<ResolvedRoute />).root.type).to.eql(ResolvedRoute);
  });
});
