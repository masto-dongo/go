//  <CommonObserveäble>
//  ===================

//  Observes an object and only renders it when it is intersecting
//  the screen.  Needs to be handed an `observer`, probably from a
//  `<CommonList>`.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

//  Other imports.
import measure from 'themes/mastodon-go/util/measure';
import schedule from 'themes/mastodon-go/util/schedule';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class CommonObserveäble extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  State.
    this.state = {
      height: 0,
      isHidden: false,
      isIntersecting: true,
    };

    //  Variables.
    this.entry = null;
    this.mounted = false;
    this.node = null;

    //  Function binding.
    const {
      handleHeight,
      handleHide,
      handleIntersection,
      handleRef,
    } = Object.getPrototypeOf(this);
    this.handleHeight = handleHeight.bind(this);
    this.handleHide = handleHide.bind(this);
    this.handleIntersection = handleIntersection.bind(this);
    this.handleRef = handleRef.bind(this);
  }

  //  On mounting, we begin observing out `node` if possible.
  componentDidMount () {
    const {
      handleIntersection,
      node,
    } = this;
    const {
      id,
      observer,
    } = this.props;
    if (observer) {
      observer.observe(id, node, handleIntersection);
      this.mounted = true;
    }
  }

  //  If for some reason our `observer` changes, we handle that here.
  //  (This shouldn't ever happen though.)
  componentWillReceiveProps (nextProps) {
    const {
      handleIntersection,
      node,
    } = this;
    const {
      id,
      observer,
    } = this.props;

    //  If we are given an observer, we observe.
    if (!observer && nextProps.observer) {
      nextProps.observer.observe(id, node, handleIntersection);
      this.mounted = true;

    //  If we lose an observer, we unobserve.
    } else if (observer && !nextProps.observer) {
      observer.unobserve(id, node);
      this.mounted = false;
      this.setState({
        isHidden: false,
        isIntersecting: true,
      });

    //  If our observer simply changes, we swap them out.
    } else if (observer && nextProps.observer && observer !== nextProps.observer) {
      observer.unobserve(id, node);
      nextProps.observer.observe(id, node, handleIntersection);
      this.setState({
        isHidden: false,
        isIntersecting: true,
      });
    }
  }

  //  On unmounting, we need to `unobserve()` our `node`.
  componentWillUnmount () {
    const { node } = this;
    const {
      id,
      observer,
    } = this.props;
    if (observer) {
      observer.unobserve(id, node);
      this.mounted = false;
    }
  }

  handleHeight () {
    // save the height of the fully-rendered element (this is expensive
    // on Chrome, where we need to fall back to getBoundingClientRect)
    const { entry } = this;
    const { isHidden } = this.state;
    if (!isHidden) {
      this.setState({ height: measure(entry).height });
    }
  }

  handleHide () {
    const { mounted } = this;
    if (!mounted) {
      return;
    }
    this.setState(
      prevState => ({ isHidden: !prevState.isIntersecting })
    );
  }

  //  This function handles intersections as detected by our observer.
  handleIntersection (entry) {
    const {
      handleHeight,
      handleHide,
    } = this;
    const { isIntersecting } = this.state;

    //  We save the intersection entry for later.
    this.entry = entry;

    //  If we are no longer intersecting, we schedule a hiding.
    if (isIntersecting && !entry.isIntersecting) {
      schedule(handleHide);
    }

    //  In the meantime, we unhide our component until we are able to
    //  get to it.
    this.setState({
      isIntersecting: entry.isIntersecting,
      isHidden: false,
    });

    //  We also schedule height calculation for the component. This
    //  is expensive on Chrome, so we can't just do it right away.
    schedule(handleHeight);
  }

  //  This stores a reference to our node.
  handleRef (node) {
    this.node = node;
  }

  //  Rendering.
  render () {
    const { handleRef } = this;
    const {
      article,
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

    //  We use an article if the `article` prop is true.
    return article ? (
      <article
        className={computedClass}
        ref={handleRef}
        style={!isIntersecting && isHidden ? { height: `${height}px` } : {}}
        tabIndex='0'
        {...rest}
      >{!isIntersecting && isHidden ? searchText || '' : children}</article>
    ) : (
      <div
        className={computedClass}
        ref={handleRef}
        style={!isIntersecting && isHidden ? { height: `${height}px` } : {}}
        tabIndex='0'
        {...rest}
      >{!isIntersecting && isHidden ? searchText || '' : children}</div>
    );
  }

}

//  Props.
CommonObserveäble.propTypes = {
  article: PropTypes.bool,  //  `true` if an `<article>` should be rendered instead of a `<div>`
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,  //  The `id` of the observable, used for intersection tracking
  observer: PropTypes.object,  //  The observable's `observer`
  searchText: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(String)]),  //  A plaintext rendition of the observable's contents
};
