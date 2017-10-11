import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import measure from 'themes/mastodon-go/util/schedule';
import schedule from 'themes/mastodon-go/util/schedule';

export default class CommonObservable extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    id: PropTypes.string,
    observer: PropTypes.object.isRequired,
    searchText: PropTypes.string,
  };
  state = {
    height: 0,
    isHidden: false,
    isIntersecting: false,
  };
  entry = null;
  mounted = false;

  componentDidMount () {
    const {
      handleIntersection,
      node,
    } = this;
    const {
      id,
      observer,
    } = this.props;
    observer.observe(id, node, handleIntersection);
    this.mounted = true;
  }

  componentWillUnmount () {
    const { node } = this;
    const {
      id,
      observer,
    } = this.props;
    observer.unobserve(id, node);
    this.mounted = false;
  }

  handleIntersection = (entry) => {
    const {
      calculateHeight,
      hide,
    } = this;
    const { isIntersecting } = this.state;
    this.entry = entry;
    if (isIntersecting && !entry.isIntersecting) {
      scheduleIdleTask(hide);
    }
    this.setState(
      prevState => ({
        isIntersecting: entry.isIntersecting,
        isHidden: false,
      })
    );
    scheduleIdleTask(calculateHeight);
  }

  calculateHeight = () => {
    // save the height of the fully-rendered element (this is expensive
    // on Chrome, where we need to fall back to getBoundingClientRect)
    const { entry } = this;
    const { isHidden } = this.state;
    if (!isHidden) {
      this.setState({ height: measure(entry).height });
    }
  }

  hide = () => {
    const { mounted } = this;
    if (!this.mounted) {
      return;
    }
    this.setState(
      prevState => ({ isHidden: !prevState.isIntersecting })
    );
  }

  handleRef = c => this.node = c;

  render () {
    const { handleRef } = this;
    const {
      children,
      className,
      id,
      observer,
      searchText,
      ...rest
    } = this.props;
    const {
      height,
      isHidden,
      isIntersecting,
    } = this.state;

    const computedClass = classNames('MASTODON_GO--COMMON--OBSERVABLE', { hidden: !isIntersecting && isHidden }, className);

    return (
      <article
        className={computedClass}
        ref={handleRef}
        style={!isIntersecting && isHidden ? { height: `${height}px` } : {}}
        tabIndex='0'
        {...rest}
      >{!isIntersecting && isHidden ? searchText || '' : children}</article>
    );
  }

}
