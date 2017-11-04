//  <RawPaneller>
//  =============

//  This component generates a panelled column with a menu and (often)
//  heading from the provided data.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  DOM imports.
import { DOMEventNavigate } from 'themes/mastodon-go/DOM';

//  Component imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class RawPaneller extends React.Component {  //  Impure

  //  Our constructor.
  constructor (props) {
    super(props);
    const { '🎛': { menu } } = this.props;

    //  State.
    this.state = { storedHash: '#' };

    //  Function binding.
    const {
      getPassableProps,
      handleHash,
    } = Object.getPrototypeOf(this);
    this.getPassableProps = getPassableProps.bind(this);
    this.handleHash = handleHash.bind(this);
    this.clicks = [handleHash.bind(this, '#')].concat((typeof menu === 'function' ? menu(getPassableProps.call(this)) : menu || []).map(
      item => item.destination ? DOMEventNavigate.bind(this, item.destination) : handleHash.bind(this, item.hash)
    ), DOMEventNavigate.bind(this, '/start'));
  }

  //  If our component is suddenly no longer the active route, we need
  //  to store its hash value before it disappears.
  componentWillReceiveProps (nextProps) {
    const {
      activeRoute,
      hash,
    } = this.props;
    if (activeRoute && !nextProps.activeRoute) {
      this.setState({ storedHash: hash });
    }
  }

  //  This gets the props we can pass to children.
  getPassableProps () {
    const { handleHash } = this;
    const {
      activeRoute,
      className,
      children,  //  Panelled components must not have children
      ℳ: messages,
      '🎛': config,
      '🏪': store,
      '💪': handler,
      ...rest
    } = this.props;
    return {
      ...rest,
      rehash: handleHash,
      ℳ: messages,
      '🏪': store,
      '💪': handler,
    };
  }

  //  This is a tiny function to update our hash if needbe.
  handleHash (hash) {
    const { activeRoute } = this.props;
    if (activeRoute) {
      DOMEventNavigate(hash);
    } else {
      this.setState({ storedHash: hash });
    }
  }

  //  Rendering.
  render () {
    const {
      clicks,
      getPassableProps,
    } = this;
    const {
      activeRoute,
      className,
      hash,
      ℳ,
      '🎛': {
        backdrop,
        className: panellerClassName,
        icon,
        menu,
        panels,
        suppressTitle,
        title,
      },
    } = this.props;
    const { storedHash } = this.state;
    const computedClass = classNames('MASTODON_GO--RAW--PANELLER', panellerClassName, { titled: title && !suppressTitle }, className);

    //  We use the provided hash if this is the active route, and the
    //  stored hash if not.
    const computedHash = activeRoute ? hash : storedHash;

    //  We get our current panel from our panels if a matching one
    //  exists.
    const panel = function () {
      let panelHash;
      if (!panels) {
        return null;
      }
      for (panelHash in panels) {
        if (computedHash === '#' + panelHash) {
          return panels[panelHash];
        }
      }
      return null;
    }();

    //  Putting everything together.
    return (
      <div className={computedClass}>
        <nav>
          {function () {

            //  If we are given an `icon`, we use it for a `#` link.
            if (icon) {
              return (
                <CommonButton
                  active={!computedHash || computedHash === '#'}
                  icon={typeof icon === 'function' ? icon(getPassableProps()) : icon}
                  onClick={clicks[0]}
                  role='link'
                  title={typeof title === 'function' ? title(getPassableProps()) : title}
                />
              );
            }
            return null;
          }()}
          {
            //  We map each menu item to a button.
            (typeof menu === 'function' ? menu(getPassableProps()) : menu || []).map(
              (item, index) => (
                <CommonButton
                  active={item.active !== void 0 ? item.active : item.hash && computedHash === item.hash}
                  icon={item.icon}
                  key={index}
                  onClick={clicks[index + 1]}
                  role='link'
                  title={item.title}
                />
              )
            )
          }
          {function () {

            //  If this is the `activeRoute`, then we render a back or
            //  close button, as necessary.
            switch (true) {
            case !activeRoute:
              return null;
            case computedHash && computedHash !== '#' && !!ℳ['⬅']:
              return (
                <CommonButton
                  className='close'
                  icon='arrow-left'
                  onClick={clicks[0]}
                  role='link'
                  title={ℳ['⬅']}
                />
              );
            case !!ℳ['❌']:
              return (
                <CommonButton
                  className='close'
                  icon='times'
                  onClick={clicks[clicks.length - 1]}
                  role='link'
                  title={ℳ['❌']}
                />
              );
            default:
              return null;
            }
          }()}
        </nav>
        {title && !suppressTitle ? (
          <header aria-hidden={!!panel}>
            <h1>{typeof title === 'function' ? title(getPassableProps()) : '' + title}</h1>
          </header>
        ) : null}
        <div className='panel'>
          {panel ? React.createElement(panel, getPassableProps()) : null}
        </div>
        <div aria-hidden={!!panel}>
          {backdrop ? React.createElement(backdrop, getPassableProps()) : null}
        </div>
      </div>
    );
  }

}

//  Props.
RawPaneller.propTypes = {
  activeRoute: PropTypes.bool,  //  `true` if the column is in the active route.
  children: PropTypes.any,  //  …but it will be ignored
  className: PropTypes.string,
  hash: PropTypes.string,  //  The current hash of the column location
  ℳ: PropTypes.func,
  '🎛': PropTypes.shape({
    backdrop: PropTypes.func,  //  The main panel, to render behind the others.
    className: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.node]),  //  The column icon
    menu: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({
      active: PropTypes.bool,  //  `true` if the menu item is active and `false` if it isn't; automatically determined if omitted
      destination: PropTypes.string,  //  The destination for the button, used in place of a hash
      hash: PropTypes.string,  //  The hash for the button
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,  //  The button icon
      title: PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(String)]),  //  The button title
    })), PropTypes.func]),
    panels: PropTypes.objectOf(PropTypes.func),  //  The (non-backdrop) panels, by hash
    suppressTitle: PropTypes.bool,  //  `true` if a title for the column should not be visually rendered
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(String), PropTypes.func]),  //  The title of the column
  }).isRequired,
  '🏪': PropTypes.object,
  '💪': PropTypes.objectOf(PropTypes.func),
};
