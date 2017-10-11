import classNames from 'classnames'
import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';

import {
  CommonButton,
  CommonMenubar,
} from 'themes/mastodon-go/components';

import './style';

export default class CatalogueMenu extends React.PureComponent {

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

  handleCatalogueClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#')
    }
  }

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
