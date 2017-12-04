import React from 'react';
import { connect } from 'react-redux';

export class ResolvingComponent extends React.PureComponent {
  componentWillMount() {
    const { resolve, dispatch, state, match: { params } } = this.props;
    this.childIsSatisfied = resolve(dispatch, state, params);
  }
  render() {
    const { resolve, dispatch, state, component: C, ...rest } = this.props;
    const childIsSatisfied = (this.childIsSatisfied) ? this.childIsSatisfied(state) : true;
    return (childIsSatisfied) ? <C {...rest} /> : null;
  }
}

export default connect(state => ({ state }))(ResolvingComponent);
