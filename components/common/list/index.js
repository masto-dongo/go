import classNames from 'classnames';
import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import './style.scss';

import Observer from 'themes/mastodon-go/util/observer';

export default class CommonList extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    onScroll: PropTypes.func,
    onScrollToBottom: PropTypes.func,
    onScrollToTop: PropTypes.func,
  };

  observer = new Observer();
  node = null;
  oldScrollPosition = 0;

  handleKeyDown = (e) => {
    const {
      ctrlKey,
      key,
      target,
    } = e;
    const { node } = this;

    if (!node) {
      return;
    }

    if (['PageDown', 'PageUp'].includes(key) || (ctrlKey && ['End', 'Home'].includes(key))) {
      const item = function () {
        switch (key) {
        case 'PageDown':
          return target.parentNode === node && target.nextElementSibling;
        case 'PageUp':
          return target.parentNode === node && target.previousElementSibling;
        case 'End':
          return node.lastElementChild;
        case 'Home':
          return node.firstElementChild;
        default:
          return null;
        }
      }();

      if (item) {
        e.preventDefault();
        item.focus();
        item.scrollIntoView();
      }
    }
  }

  handleScroll = throttle(
    () => {
      const { node } = this;
      const {
        onScrollToBottom,
        onScrollToTop,
        onScroll,
      } = this.props;
      if (node) {
        const {
          clientHeight,
          scrollHeight,
          scrollTop,
        } = this.node;
        const offset = scrollHeight - scrollTop - clientHeight;
        this.oldScrollPosition = scrollHeight - scrollTop;

        if (400 > offset && onScrollToBottom) {
          onScrollToBottom();
        } else if (scrollTop < 100 && onScrollToTop) {
          onScrollToTop();
        } else if (onScroll) {
          onScroll();
        }
      }
    },
    150, { trailing: true }
  );

  componentDidMount () {
    const {
      observer,
      handleScroll,
      node,
    } = this;
    observer.connect({
      root: node,
      rootMargin: '300% 0px',
    });
    node.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  componentDidUpdate (prevProps) {
    const {
      node,
      oldScrollPosition,
    } = this;
    const { children } = this.props;
    if (node && oldScrollPosition) {
      const {
        scrollHeight,
        scrollTop,
      } = node;
      const newItems = (
        () => {
          switch (true) {
          case React.Children.count(prevProps.children) <= 0:
          case React.Children.count(prevProps.children) >= React.Children.count(children):
          case prevProps.children[0].key === children[0].key:
            return false;
          default:
            return true;
          }
        }
      )();

      // Reset the scroll position when a new child comes in in order not to
      // jerk the scrollbar around if you're already scrolled down the page.
      if (newItems && scrollTop > 0) {
        const newScrollTop = scrollHeight - oldScrollPosition;
        if (scrollTop !== newScrollTop) {
          node.scrollTop = newScrollTop;
        }
      } else {
        this.oldScrollPosition = scrollHeight - scrollTop;
      }
    }
  }

  componentWillUnmount () {
    const {
      observer,
      handleScroll,
      node,
    } = this;
    node.removeEventListener('scroll', handleScroll);
    observer.disconnect();
  }

  setRef = (c) => this.node = c;

  render () {
    const {
      Observer,
      handleKeyDown,
    } = this;
    const {
      children,
      className,
      isLoading,
      onScroll,
      onScrollToBottom,
      onScrollToTop,
      ...rest
    } = this.props;

    const computedClass = classNames('MASTODON_GO--COMMON--LIST', { loading: isLoading }, className);

    return (
      <div
        className={computedClass}
        onKeyDown={handleKeyDown}
        ref={this.setRef}
        role='feed'
        {...rest}
      >
        {
          React.Children.map(
            children,
            child => child ? React.cloneElement(child, { observer }) : null
          )
        }
      </div>
    );
  }

}
