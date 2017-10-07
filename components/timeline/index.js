import classNames from 'classnames'
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';

import { StatusContainer } from 'themes/mastodon-go/components';

import {
  CommonButton,
  CommonMenu,
  CommonHeader,
} from 'themes/mastodon-go/components';

import './style';

const messages = defineMessages({
  timeline: {
    defaultMessage: "Timeline",
    id: "timeline.timeline",
  }
})

export default class Timeline extends React.PureComponent {

  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    handler: PropTypes.objectOf(PropTypes.func).isRequired,
    hash: PropTypes.string,
    history: PropTypes.object,
    icon: PropTypes.string,
    intl: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    location: PropTypes.object,  //  Not updated; don't use
    match: PropTypes.object,  //  Not updated; don't use
    rainbow: ImmutablePropTypes.map.isRequired,
    path: PropTypes.string.isRequired,
    statuses: ImmutablePropTypes.list,
    staticContext: PropTypes.object,  //  Unused
    title: PropTypes.node,
  };
  state = {
    currentDetail: null,
  }
  node = null;

  constructor (props) {
    super(props);
    const { handler: { fetch } } = this.props;
    fetch();
  }

  handleKeyDown = (e) => {
    const {
      ctrlKey,
      key,
      target,
    } = e;
    const { node } = this;
    if (['PageDown', 'PageUp'].includes(key) || (ctrlKey && ['End', 'Home'].includes(key))) {
      const article = (() => {
        switch (key) {
        case 'PageDown':
          return target.nodeName === 'ARTICLE' && target.nextElementSibling;
        case 'PageUp':
          return target.nodeName === 'ARTICLE' && target.previousElementSibling;
        case 'End':
          return node.querySelector('[role="feed"] > article:last-of-type');
        case 'Home':
          return node.querySelector('[role="feed"] > article:first-of-type');
        default:
          return null;
        }
      })();


      if (article) {
        e.preventDefault();
        article.focus();
        article.scrollIntoView();
      }
    }
  }

  handleLoadMore = () => {
    const { handler } = this.props;
    handler.expand();
  }

  handleSetDetail = (id) => {
    this.setState({ currentDetail : id });
  }

  handleTimelineClick = () => {
    //  TK
  }

  setRef = node => {
    this.node = node;
  }

  render () {
    const {
      handleKeyDown,
      handleTimelineClick,
      setRef,
    } = this;
    const {
      activeRoute,
      className,
      handler,
      hash,
      history,
      icon,
      intl,
      isLoading,
      location,
      match,
      rainbow,
      path,
      staticContext,
      statuses,
      title,
      ...rest
    } = this.props;

    const computedClass = classNames('MASTODON_GO--TIMELINE', className);

    return (
      <div
        className={computedClass}
        onKeyDown={handleKeyDown}
        ref={setRef}
        role='feed'
        {...rest}
      >
        <CommonMenu>
          <CommonButton
            active
            destination={activeRoute ? "#" : undefined}
            icon={icon}
            onClick={!activeRoute ? handleTimelineClick : undefined}
            style={true ? { backgroundImage: `linear-gradient(160deg, ${rainbow.get('3').join(', ')})` } : { color: rainbow.get('1') }}
            title={intl.formatMessage(messages.timeline)}
          />
        </CommonMenu>
        <CommonHeader
          backgroundImage={`linear-gradient(160deg, ${rainbow.get('7').join(', ')})`}
          colour={rainbow.get('1')}
        >{title}</CommonHeader>
        <div className='content'>
          {statuses ? statuses.map((id, index) => (
            <StatusContainer
              key={id}
              id={id}
              index={index}
              listLength={statuses.size}
              detailed={currentDetail === id}
              setDetail={handleSetDetail}
            />
          )) : null}
        </div>
        {isLoading || true ? (
          <div
            className='loading_bar'
            style={{ backgroundImage: `linear-gradient(90deg, ${rainbow.get('7').join(', ')}, ${rainbow.getIn(['7', 0])})` }}
          />
        ) : null}
      </div>
    );
  }

}
