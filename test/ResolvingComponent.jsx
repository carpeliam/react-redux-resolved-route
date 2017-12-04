import React from 'react';
import { expect } from 'chai';
import TestRenderer from 'react-test-renderer';
import { ResolvingComponent } from '../src/ResolvingComponent';

function ChildComponent(props) {
  return <div>I'm a child component!</div>;
}

describe('ResolvingComponent', () => {
  const expectedDispatch = () => {};
  const expectedState = { state: 'current state' };
  const expectedParams = { id: '1' };
  it('passes dispatch, current state, and URL params to resolve', (done) => {
    function resolve(dispatch, state, params) {
      expect(dispatch).to.eql(expectedDispatch);
      expect(state).to.eql(expectedState);
      expect(params).to.eql(expectedParams);
      done();
    }

    try {
      TestRenderer.create(
        <ResolvingComponent
          resolve={resolve}
          dispatch={expectedDispatch}
          state={expectedState}
          match={{ params: expectedParams }}
          component={ChildComponent}
        />
      );
    } catch (e) {
      done(e);
    }
  });

  it('passes additional props to child component', () => {
    const additionalProps = {
      match: { path: '/', params: {} },
      location: { pathname: '/' },
    };
    const testRenderer = TestRenderer.create(
      <ResolvingComponent
        resolve={() => () => true}
        dispatch={expectedDispatch}
        state={expectedState}
        component={ChildComponent}
        {...additionalProps}
      />
    );
    const testInstance = testRenderer.root;
    const childComponent = testInstance.findByType(ChildComponent);
    expect(childComponent.props.resolve).to.be.undefined;
    expect(childComponent.props.dispatch).to.be.undefined;
    expect(childComponent.props.state).to.be.undefined;
    expect(childComponent.props.component).to.be.undefined;
    expect(childComponent.props.match).to.eql(additionalProps.match);
    expect(childComponent.props.location).to.eql(additionalProps.location);
  });

  context('with a resolve function that does not return anything', () => {
    it('renders the child component', () => {
      const testRenderer = TestRenderer.create(
        <ResolvingComponent
          resolve={() => {}}
          dispatch={expectedDispatch}
          state={expectedState}
          match={{ params: expectedParams }}
          component={ChildComponent}
        />
      );
      const testInstance = testRenderer.root;
      const childComponent = testInstance.findByType(ChildComponent);
      expect(childComponent).to.exist;
    });
  });
});
