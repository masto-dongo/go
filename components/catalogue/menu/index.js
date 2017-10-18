/*********************************************************************\
|                                                                     |
|   <CatalogueMenu>                                                   |
|   ===============                                                   |
|                                                                     |
|   Right now, the catalogue menu is just presented for consistency   |
|   and doesn't actually do anything useful (there aren't any panes   |
|   for you to navigate to in a catalogue).  But that may change at   |
|   some point in the future.                                         |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Common imports.
import {
  CommonButton,
  CommonMenubar,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class CatalogueMenu extends React.PureComponent {

  //  Props.
  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    hash: PropTypes.string,
    history: PropTypes.object,
    icon: PropTypes.string,
    intl: PropTypes.object.isRequired,
    onSetHash: PropTypes.func,
    title: PropTypes.string,
  };

  //  Click handling.
  handleCatalogueClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#');
    }
  };

  //  Rendering.
  render () {
    const { handleCatalogueClick } = this;
    const {
      activeRoute,
      className,
      hash,
      history,
      icon,
      intl,
      onSetHash,
      title,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CATALOGUE--MENU', className);

    //  Our menu is just a button in a menubar.
    return (
      <CommonMenubar
        activeRoute={activeRoute}
        className={computedClass}
        hash={hash}
        history={history}
        intl={intl}
        {...rest}
      >
        <CommonButton
          active={!hash || hash === '#'}
          destination={activeRoute ? '#' : undefined}
          history={history}
          icon={icon}
          onClick={!activeRoute ? handleCatalogueClick : undefined}
          title={title}
        />
      </CommonMenubar>
    );
  }

}
