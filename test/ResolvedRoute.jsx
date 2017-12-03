import React from 'react';
import { expect } from 'chai';
import TestRenderer from 'react-test-renderer';

import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { ConnectedRouter as Router, routerReducer, routerMiddleware } from 'react-router-redux';
import { Route, MemoryRouter } from 'react-router';

import ResolvedRoute from '../src/ResolvedRoute';

function ThingsComponent(props) {
  return <div>I have every thing I need to be rendered!</div>;
}

function things(state = [], action) {
  switch (action.type) {
    case 'FETCH_THINGS': return action.things;
    default: return state;
  }
}

function fetchThings() {
  return { type: 'FETCH_THINGS', things: ['Thing 1', 'Thing 2'] };
}

function resolveThings(dispatch, state, params) {
  return ({ things }) => !!things.length;
}

describe('ResolvedRoute', () => {
  let store;
  beforeEach(() => {
    store = createStore(combineReducers({ things }));
  });
  it('only renders its component after the resolve function has resolved', () => {
    const testRenderer = TestRenderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <ResolvedRoute component={ThingsComponent} resolve={resolveThings} />
        </MemoryRouter>
      </Provider>
    );
    const testInstance = testRenderer.root;

    expect(testInstance.findAllByType(ThingsComponent)).to.be.empty;
    store.dispatch(fetchThings());
    expect(testInstance.findAllByType(ThingsComponent)).not.to.be.empty;
  });

  it('passes Route props to the Route', () => {
    const testRenderer = TestRenderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <ResolvedRoute exact path="/" component={ThingsComponent} resolve={resolveThings} />
        </MemoryRouter>
      </Provider>
    );
    const testInstance = testRenderer.root;

    const route = testInstance.findByType(Route);
    expect(route.props.exact).to.be.true;
    expect(route.props.path).to.be.eql('/');
  });
});
