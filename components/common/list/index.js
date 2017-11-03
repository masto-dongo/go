//  <CommonList>
//  ============

//  Renders a list of statuses, notifications, accounts, or similar
//  items.  Designed for use alongside `<CommonObserveäble>`.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import Observer from 'themes/mastodon-go/util/observer';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class CommonList extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  Variables.  We create a new observer for tracking list items.
    this.observer = new Observer;
    this.node = null;
    this.oldScrollPosition = 0;

    //  Function binding.
    const {
      handleKeyDown,
      handleRef,
      handleScroll,
    } = Object.getPrototypeOf(this);
    this.handleKeyDown = handleKeyDown.bind(this);
    this.handleRef = handleRef.bind(this);
    this.handleScroll = throttle(handleScroll.bind(this), 150, { trailing: true });
  }

  //  After mounting, we need to connect our observer to our `node`.
  componentDidMount () {
    const {
      handleScroll,
      node,
      observer,
    } = this;
    observer.connect({
      root: node,
      rootMargin: '300% 0px',
    });

    //  We call `handleScroll` immediately to save our scrolling
    //  position.
    node.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  //  When our component updates, we do our best to prevent the list
  //  from jumping when new children are added to the top.
  componentDidUpdate (prevProps) {
    const {
      node,
      oldScrollPosition,
    } = this;
    const { children } = this.props;

    //  If we don't have an `oldScrollPosition` (or a `node`), there's
    //  nothing we can do.
    if (node && oldScrollPosition) {
      const {
        scrollHeight,
        scrollTop,
      } = node;

      //  This returns `true` if new items have been added to the
      //  beginning of the list, and `false` otherwise.
      const newItems = function () {
        switch (true) {
        case React.Children.count(prevProps.children) <= 0:
        case React.Children.count(prevProps.children) >= React.Children.count(children):
        case (prevProps.children[0] || {}).key === (children[0] || {}).key:
          return false;
        default:
          return true;
        }
      }();

      //  If there are new items, we reset the scroll position so that
      //  our distance from the bottom remains unchanged.
      if (newItems && scrollTop > 0) {
        const newScrollTop = scrollHeight - oldScrollPosition;
        if (scrollTop !== newScrollTop) {
          node.scrollTop = newScrollTop;
        }

      //  Otherwise, we simply store our scroll position for later use.
      } else {
        this.oldScrollPosition = scrollHeight - scrollTop;
      }
    }
  }

  //  If our component is about to unmount, we remove our listeners and
  //  `disconnect()` our observer.
  componentWillUnmount () {
    const {
      handleScroll,
      node,
      observer,
    } = this;
    node.removeEventListener('scroll', handleScroll);
    observer.disconnect();
  }

  //  We track PageDown/PageUp/End/Home keypresses and handle them
  //  accordingly.
  handleKeyDown (e) {
    const {
      ctrlKey,
      key,
      target,
    } = e;
    const { node } = this;

    //  We need a node in order to be able to scroll it.
    if (!node) {
      return;
    }

    //  We only track End and Home if the `ctrl` key is also held.
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

      //  If we have an item to scroll to, we scroll there and bring it
      //  into focus.
      if (item) {
        e.preventDefault();  //  Prevents default PageDown/PageUp/Home/End behaviour
        item.focus();
        item.scrollIntoView();
      }
    }
  }

  //  This stores a reference to our node.
  handleRef (node) {
    this.node = node;
  }

  //  We keep track of our scroll position on scrolling, and also allow
  //  for the dispatching of functions.
  handleScroll () {
    const { node } = this;
    const {
      onScrollToBottom,
      onScrollToTop,
      onScroll,
    } = this.props;

    //  Naturally, we can only handle scrolling if there is a `node`
    //  which can be scrolled.
    if (node) {
      const {
        clientHeight,
        scrollHeight,
        scrollTop,
      } = this.node;

      //  We keep track of our position from the *bottom* of the box,
      //  not the top (where new items are more likely to be added).
      const offset = scrollHeight - scrollTop - clientHeight;
      this.oldScrollPosition = scrollHeight - scrollTop;

      //  This calls our associated scrolling functions.
      if (400 > offset && onScrollToBottom) {
        onScrollToBottom();
      } else if (scrollTop < 100 && onScrollToTop) {
        onScrollToTop();
      }
      onScroll();
    }
  }

  //  Rendering.
  render () {
    const {
      handleKeyDown,
      handleRef,
      handleScroll,
      observer,
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
        onScroll={handleScroll}
        ref={handleRef}
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

//  Props.
CommonList.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isLoading: PropTypes.bool,  //  Whether the list is still loading content; renders a loading bar
  onScroll: PropTypes.func,  //  A function to call on any scroll
  onScrollToBottom: PropTypes.func,  //  A function to call when scrolling near the bottom
  onScrollToTop: PropTypes.func,  //  A function to call when scrolling near the top
};
