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
import classNames from 'classnames'
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
    rainbow: ImmutablePropTypes.map.isRequired,
    title: PropTypes.node,
  };

  //  Click handling.
  handleCatalogueClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#')
    }
  }

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
      rainbow,
      title,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CATALGOUE--MENU', className);

    //  Our menu is just a button in a menubar.
    return (
      <CommonMenubar
        className={computedClass}
        {...rest}
      >
        <CommonButton
          active
          destination={activeRoute ? '#' : undefined}
          history={history}
          icon={icon}
          onClick={!activeRoute ? handleCatalogueClick : undefined}
          style={hash !== '#settings' ? { backgroundImage: `linear-gradient(160deg, ${rainbow.get('3').join(', ')})` } : { color: rainbow.get('1') }}
          title={title}
        />
      </CommonMenubar>
    );
  }

}
