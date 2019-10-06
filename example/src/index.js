import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { Route } from 'react-router';
import { ConnectedRouter as Router, routerReducer, routerMiddleware } from 'react-router-redux';
import { Link } from 'react-router-dom';

import ResolvedRoute from 'react-redux-resolved-route';

const history = createBrowserHistory();

const store = createStore(
  combineReducers({ things, router: routerReducer }),
  compose(applyMiddleware(thunk, routerMiddleware(history))),
);

// actions
function getThings() {
  return dispatch => setTimeout(() => dispatch({
    type: 'FETCH_THINGS',
    things: [{ id: 1, name: 'Thing 1' }, { id: 2, name: 'Thing 2' }],
  }), 1000);
}

function getThing(id) {
  const thing = { id, name: `Thing ${id}` };
  return dispatch => setTimeout(() => dispatch({ type: 'FETCH_THING', thing }), 1000);
}

// reducer
function things(state = [], action) {
  switch (action.type) {
    case 'FETCH_THINGS': return action.things;
    case 'FETCH_THING': return [action.thing];
    default: return state;
  }
}

// components
function Thing({ thing }) {
  const { id, name } = thing;
  return (
    <div>
      <div><strong>ID: </strong> {id}</div>
      <div><strong>Name: </strong> <Link to={`/things/${id}`}>{name}</Link></div>
    </div>
  );
}
function mapStateToPropsForThing({ things }, { match: { params: { id } } }) {
  return { thing: things.find(t => t.id === parseInt(id, 10)) };
}
const ThingContainer = connect(mapStateToPropsForThing)(Thing);

function Things({ things }) {
  return (
    <div>
      {things.map(thing => <Thing key={thing.id} thing={thing} />)}
    </div>
  );
}
const ThingsContainer = connect(({ things }) => ({ things }))(Things);



/* resolve functions *******************/
function resolveThings(dispatch, state, params) {
  const thingsExist = ({ things }) => things.length;
  if (!thingsExist(state)) {
    dispatch(getThings());
    return thingsExist;
  }
}

function resolveThing(dispatch, state, params) {
  const id = parseInt(params.id, 10);
  const thingExists = ({ things }) => things.find(t => t.id === id);
  if (!thingExists(state)) {
    dispatch(getThing(id));
    return thingExists;
  }
}


render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Route exact path="/" component={() => (<h1>Home <Link to="/things">Things</Link></h1>)} />
        <ResolvedRoute exact path="/things" component={ThingsContainer} resolve={resolveThings} />
        <ResolvedRoute exact path="/things/:id" component={ThingContainer} resolve={resolveThing} />
      </div>
    </Router>
  </Provider>, document.getElementById('root')
);
