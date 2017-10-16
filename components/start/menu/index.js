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
export default class StartMenu extends React.PureComponent {

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
  handleStartClick = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#');
    }
  };

  //  Rendering.
  render () {
    const { handleStartClick } = this;
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
    const computedClass = classNames('MASTODON_GO--START--MENU', className);

    //  Our menu is just a button in a menubar.
    return (
      <CommonMenubar
        className={computedClass}
        {...rest}
      >
        <CommonButton
          active={!hash || hash === '#'}
          destination={activeRoute ? '#' : undefined}
          history={history}
          icon={icon}
          onClick={!activeRoute ? handleStartClick : undefined}
          title={title}
        />
      </CommonMenubar>
    );
  }

}
