//  <UI>
//  ====

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import UIColumn from './column';
import UIModal from './modal';

//  Stylesheet imports.
import './style';

export default class UI extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    history: PropTypes.object,
    intl: PropTypes.object.isRequired,
    location: PropTypes.object,
    match: PropTypes.object,
  };

  //  TK: Drag and Drop API

  //  TK: Push notificaitons

  render () {
    const {
      className,
      history,
      intl,
      location,
      match,
      ...rest
    } = this.props;

    const computedClass = classNames('MASTODON_GO--UI', className);

    const singleColumn = true;  //  for now

    return (
      <div
        className={computedClass}
        //{...rest}
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
