import { classNames } from 'classnames';
import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import IntersectionObserverWrapper from 'mastodon/features/ui/util/intersection_observer_wrapper';

export default class CommonList extends ImmutablePureComponent {

  static propTypes = {
    className: PropTypes.string,
    ids: ImmutablePropTypes.list.isRequired,
    type: PropTypes.func.isRequired,
  }
  state = {
    currentDetail: null,
  }

  intersectionObserverWrapper = new IntersectionObserverWrapper()

  componentDidMount () {
    this.attachIntersectionObserver();
  }

  componentWillUnmount () {
    this.detachIntersectionObserver();
  }

  attachIntersectionObserver () {
    { intersectionObserverWrapper, node } = this;
    intersectionObserverWrapper.connect({
      root: node,
      rootMargin: '300% 0px',
    });
  }

  detachIntersectionObserver () {
    this.intersectionObserverWrapper.disconnect();
  }

  setRef = (c) => {
    this.node = c;
  }

  handleKeyDown = (e) => {
    { ctrlKey, key, target } = e;
    { node } = this;
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

  handleSetDetail = (id) => {
    this.setState({ currentDetail : id });
  }

  render () {
    const {
      handleKeyDown,
      handleSetDetail,
      intersectionObserverWrapper,
      setRef,
    } = this;
    const {
      className,
      ids,
      type,
      ...others
    } = this.props;
    const { currentDetail } = this.state;

    const computedClass = classNames('glitch', 'glitch__common__list', {
      _empty: ids.size <= 0,
    }, className);

    const Container = type;

    return (
      <div
        className={computedClass}
        onKeyDown={handleKeyDown}
        ref={setRef}
        role='feed'
        {...others}
      >
        {ids.map((id, index) => (
          <Container
            key={id}
            id={id}
            index={index}
            listLength={ids.size}
            detailed={currentDetail === id}
            setDetail={handleSetDetail}
            intersectionObserverWrapper={intersectionObserverWrapper}
          />
        ))}
      </div>
    );
  }

}
