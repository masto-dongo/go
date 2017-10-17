//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';

//  Common imports.
import {
  CommonButton,
  CommonMenubar,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  drawer: {
    defaultMessage: 'Compose',
    id: 'drawer.drawer',
  },
  search: {
    defaultMessage: 'Search',
    id: 'drawer.search',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class DrawerMenu extends React.PureComponent {

  //  Props.
  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    hash: PropTypes.string,
    history: PropTypes.object,
    intl: PropTypes.object.isRequired,
    onSetHash: PropTypes.func,
  };

  //  Click handling.
  handleDrawerClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#');
    }
  };
  handleSearchClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#search');
    }
  }

  //  Rendering.
  render () {
    const {
      handleDrawerClick,
      handleSearchClick,
    } = this;
    const {
      activeRoute,
      className,
      hash,
      history,
      intl,
      onSetHash,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--START--MENU', className);

    //  Our menu is just a button in a menubar.
    return (
      <CommonMenubar
        activeRoute={activeRoute}
        className={computedClass}
        history={history}
        intl={intl}
        {...rest}
      >
        <CommonButton
          active={!hash || hash === '#'}
          destination={activeRoute ? '#' : undefined}
          history={history}
          icon='pencil-square'
          onClick={!activeRoute ? handleDrawerClick : undefined}
          title={intl.formatMessage(messages.drawer)}
        />
        <CommonButton
          active={hash === '#search'}
          destination={activeRoute ? '#search' : undefined}
          history={history}
          icon='search'
          onClick={!activeRoute ? handleSearchClick : undefined}
          title={intl.formatMessage(messages.search)}
        />
      </CommonMenubar>
    );
  }

}
