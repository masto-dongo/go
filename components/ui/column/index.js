import classNames from 'classnames';
import detectPassiveEvents from 'detect-passive-events';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { scrollTop } from 'mastodon/scroll';

import ColumnHeader from './header';
import ColumnSettings from './settings';
import CommonScrollable from 'glitch/components/common/scrollable';

import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

const messages = defaultMessages({
  moveLeft:
    { id: 'column_header.moveLeft_settings', defaultMessage: 'Move column to the left' },
  moveRight:
    { id: 'column_header.moveRight_settings', defaultMessage: 'Move column to the right' },
  pin:
    { id: 'column_header.pin', defaultMessage: 'Pin' },
  show:
    { id: 'column_header.show_settings', defaultMessage: 'Show settings' },
  unpin:
    { id: 'column_header.unpin', defaultMessage: 'Unpin' },
});

export default class UIColumn extends React.PureComponent {

  //  Props and state.
  static propTypes = {
    className: PropTypes.string,
    handler: PropTypes.objectOf(PropTypes.func).isRequired,
    history: PropTypes.object,
    intl: PropTypes.object.isRequired,
    meta: PropTypes.object,
    pinned: PropTypes.bool,
    type: PropTypes.string.isRequired,
    uuid: PropTypes.string,
  };
  state = {
    togglesVisible: false,
  }
  interruptScrollAnimation = null;

  handleBackClick = () => {
    const { history } = this.props;
    if (history && history.length === 1) history.push('/');
    else history.goBack();
  }

  handleToggleClick = () => {
    this.setState({ togglesVisible: !this.state.togglesVisible});
  }

  //  These functions handle column pinning and unpinning.
  handlePin = () => {
    { handler } = this.props;
    handler.pin(true);
  }
  handleUnpin = () => {
    { handler } = this.props;
    handler.pin(false);
  }

  //  These functions handle column moving for pinned columns.
  handleMoveLeft = () => {
    { handler } = this.props;
    handler.move(-1);
  }
  handleMoveRight = () => {
    { handler } = this.props;
    handler.move(1);
  }

  handleWheel = () => {
    if (typeof this.interruptScrollAnimation !== 'function') return;
    this.interruptScrollAnimation();
  }

  setRef = c => {
    this.node = c;
  }

  componentDidMount () {
    this.node.addEventListener('wheel', this.handleWheel,  detectPassiveEvents ? { passive: true } : false);
  }

  componentWillUnmount () {
    this.node.removeEventListener('wheel', this.handleWheel);
  }

  render () {
    const {
      className,
      handler,
      history,
      intl: { formatMessage },
      meta,
      pinned,
      type,
      uuid,
      ...others
    } = this.props;
    const { togglesVisible } = this.state;
    const computedClass = classNames('glitch', 'glitch__column', className);

    //  `toggles` holds our various column toggles.
    const toggles = [];

    //  If our column is pinned, then we provide buttons to unpin it or
    //  change its position. Otherwise, if it's pinnable, we provide
    //  a button to let it be pinned.
    if (pinned) toggles.push(
      <div className='column\pinning' key='pinning'>
        <CommonButton
          active
          className='column\unpin column\settings-button'
          icon='times'
          key='pin'
          onClick={handleUnpin}
          title={formatMessage(messages.pin)}
        ><FormattedMessage {...messages.unpin} /></CommonButton>
        <CommonButton
          className='column\move-left column\settings-button'
          icon='chevron-left'
          onClick={handleMoveLeft}
          title={formatMessage(messages.moveLeft)}
        />
        <CommonButton
          className='column\move-right column\settings-button'
          icon='chevron-right'
          onClick={handleMoveRight}
          title={formatMessage(messages.moveRight)}
        />
      </div>
    );

    //  We only allow non-user timelines to be pinned.
    else if (type === 'timeline' && meta.name !== 'account') toggles.push(
      <div className='column\pinning' key='pinning'>
        <CommonButton
          className='column\pin column\settings-button'
          icon='times'
          key='pin'
          onClick={handlePin}
          showTitle
          title={formatMessage(messages.pin)}
        />
      </div>
    );

    return (
      <section
        aria-labelledby={`glitch:col${uuid || '?'}_h`}
        className={computedClass}
        id={`glitch:col${uuid || '?'}`}
        ref={this.setRef}
        role='region'
        {...others}
      >
        <ColumnHeader
          className='column\header'
          icon={icon}
          id={`glitch:col${uuid || '?'}_h`}
          title={title}
        >
          {buttons}
          {settings.length ? (
            <CommonButton
              active={settingsVisible}
              className='column\settings column\button'
              icon='sliders'
              onClick={handleToggle}
              title={formatMessage(messages.show)}
            />
          ) : null}
        </ColumnHeader>
        {toggles.length ? (
        <ColumnSettings
          className='column\settings'
          expanded={togglesVisible}
        >{toggles}</ColumnSettings>
        ) : null}
        <CommonScrollable className='column\scroll'>
          <ColumnContent
            meta={meta}
            type={type}
          />
        </CommonScrollable>
      </section>
    );
  }

}
