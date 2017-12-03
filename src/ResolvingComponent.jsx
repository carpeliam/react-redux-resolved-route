import React from 'react';
import { connect } from 'react-redux';

export class ResolvingComponent extends React.PureComponent {
  componentWillMount() {
    const { resolve } = this.props;
    this.childIsSatisfied = resolve();
  }
  render() {
    const { component: C, state } = this.props;
    return (this.childIsSatisfied(state)) ? <C /> : null;
  }
}

export default connect(state => ({ state }))(ResolvingComponent);
