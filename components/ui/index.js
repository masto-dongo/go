//  <UI>
//  ====

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import UIColumn from './column';
import UIModal from './modal';

//  Stylesheet imports.
import './style';

export default class UI extends React.Component {  //  Impure

  static propTypes = {
    className: PropTypes.string,
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    staticContext: PropTypes.object,  //  Unused
    '🛄': PropTypes.shape({ intl: PropTypes.object.isRequired }).isRequired,
    '💪': PropTypes.objectOf(PropTypes.func).isRequired,
    '🏪': PropTypes.shape({}),
  };

  constructor (props) {
    super(props);
    const { '💪': { fetch } } = props;
    fetch();
  }

  //  TK: Drag and Drop API

  //  TK: Push notificaitons

  render () {
    const {
      className,
      history,
      location,
      match,
      staticContext,
      '🛄': { intl },
      '💪': handler,
      '🏪': store,
      ...rest
    } = this.props;

    const computedClass = classNames('MASTODON_GO--UI', className);

    const singleColumn = true;  //  for now
    const columns = { size: 0 };  //  for now

    return (
      <div
        className={computedClass}
        {...rest}
      >
        <UIModal history={history} />
        <UIColumn
          activeRoute
          history={history}
          index={!singleColumn ? columns.size : 0}
          intl={intl}
          location={location}
          singleColumn={singleColumn}
        />
      </div>
    );
  }

}
