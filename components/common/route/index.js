import React from 'react';
import PropTypes from 'prop-types';

// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
// Small Wraper
export class CommonRoute extends React.Component {

  static propTypes = {
    component: PropTypes.func.isRequired,
    children: PropTypes.node,
    props: PropTypes.oneOf([PropTypes.func, PropTypes.object]),
  }

  Renderer = ({ match: { params } }) => {
    const {
      component: Component,
      children,
      props,
    } = this.props;
    let additionalProps = {}
    if (props) additionalProps = typeof props === 'function' ? props(params) : props;

    return <Component {...additionalProps}>{children}</Component>;
  }

  render () {
    const { Renderer } = this;
    const {
      component,
      children,
      props,
      ...others
    } = this.props;
    return <Route render={Renderer} {...others} />;
  }

}

