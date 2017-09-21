//  <CommonExpandable>
//  ================

//  For code documentation, please see:
//  https://glitch-soc.github.io/docs/javascript/glitch/common/expandable

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

export default class ColumnSettings extends React.PureComponent {

  //  Props and state.
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    expanded: PropTypes.bool,
    focusable: PropTypes.bool,
  }
  state = {
    animating: false,
  }

  //  If our component is de-expanding, then we know that it is about
  //  to start animating. We set the state ahead of time so that there
  //  isn't a stray render cycle where the component is neither
  //  expanded nor animating before detecting the transition start.
  componentWillReceiveProps (nextProps) {
    const { expanded } = this.props;
    if (expanded && !nextProps.expanded) this.setState({ animating: true });
  }

  //  When the transition ends, we set `animating` to `false`.
  handleTransitionEnd = () => {
    this.setState({ animating: false });
  }

  //  Rendering.
  render () {
    const { handleTransitionEnd } = this;
    const { children, className, expanded, focusable } = this.props;
    const { animating } = this.state;
    const computedClass = classNames('glitch', 'glitch__expandable', {
      _expanded: expanded,
    }, className);

    //  We only set tabIndex if the component is focusable and
    //  expanded. If the component is not available, then the `hidden`
    //  attribute is appropriate.
    const conditionalProps = {}
    if (expanded && focusable) conditionalProps.tabIndex = 0;
    if (!expanded && !animating) conditionalProps.hidden = true;

    //  We only render the children of the expandable if it is actually
    //  expanded.
    return (
      <div
        className={computedClass}
        {...conditionalProps}
        onTransitionEnd={this.handleTransitionEnd}
      >
          {expanded || animating ? children : null}
      </div>
    );
  }

}
