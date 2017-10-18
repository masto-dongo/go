//  Package imports
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports
import DrawerComposerInputMenu from './menu';

//  Stylesheet imports
import './style';

export default class DrawerComposerInput extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    intl: PropTypes.object.isRequired,
  };
  state = {
    currentTab: 0,
  };

  handleTab = index => {
    this.setState({ currentTab: index });
  }

  render () {
    const { handleTab } = this;
    const {
      className,
      intl,
      ...rest
    } = this.props;
    const { currentTab } = this.state;
    const computedClass = classNames('MASTODON_GO--DRAWER--COMPOSER--INPUT', className);

    return (
      <div
        className={computedClass}
        {...rest}
      >
        {function () {
          switch (currentTab) {
          default:
            return null;
          }
        }}
        <DrawerComposerInputMenu
          intl={intl}
          onChange={handleTab}
          value={currentTab}
        />
      </div>
    );
  }

}

