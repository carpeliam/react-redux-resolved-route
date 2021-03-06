# react-redux-resolved-route

Wouldn't it be nice if the components underneath your routes had everything they needed before they were rendered? Now they can.

When using [react-router-redux](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux), supply a `resolve` function to your route to indicate what your route needs before rendering.

Here's an example, using `react-router-redux`:
```js
import { Route } from 'react-router'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import ResolvedRoute from 'react-redux-resolved-route' // <== This library, right here
import { getThing, getThings } from './actions' // Or wherever you keep your actions

const history = createHistory()
const store = createStore(
  combineReducers({ ...reducers, router: routerReducer }),
  applyMiddleware(routerMiddleware(history))
)

// A resolve function receives store.dispatch, the current redux state, and any URL parameters
function resolveThings(dispatch, state, params) {
  const thingsExist = ({ things }) => things.length
  if (!thingsExist(state)) {
    dispatch(getThings())
    // Return a function that receives the state and returns true if the component can be rendered
    return thingsExist
  }
}

function resolveThing(dispatch, state, params) {
  const id = parseInt(params.id, 10)
  const thingExists = ({ things }) => things.find(t => t.id === id)
  if (!thingExists(state)) {
    dispatch(getThing(id))
    return thingExists
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
        <ResolvedRoute path="/things" component={Things} resolve={resolveThings}/>
        <ResolvedRoute path="/things/:id" component={Thing} resolve={resolveThing}/>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
```
