//  <StatusContent>
//  ===============

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import {
  CommonButton,
  ConnectedCard,
  ConnectedParse,
  ConnectedReference,
} from 'themes/mastodon-go/components';

// import StatusContentGallery from './gallery';
// import StatusContentUnknown from './unknown';
const ConnectedStatusContentGallery = () => null;
const ConnectedStatusContentUnknown = () => null;

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

export default class ConnectedStatusContent extends React.PureComponent {

  //  Props and state.
  static propTypes = {
    card: ImmutablePropTypes.map,
    className: PropTypes.string,
    content: PropTypes.string,
    contentVisible: PropTypes.bool,
    detailed: PropTypes.bool,
    history: PropTypes.object,
    media: ImmutablePropTypes.list,
    mentions: ImmutablePropTypes.list,
    onClick: PropTypes.func,
    sensitive: PropTypes.bool,
    setExpansion: PropTypes.func,
    small: PropTypes.bool,
    spoiler: PropTypes.string,
    tags: ImmutablePropTypes.list,
    ℳ: PropTypes.func.isRequired,
  }

  //  Variables.
  startXY = null

  //  When the mouse is pressed down, we grab its position.
  handleMouseDown = (e) => {
    this.startXY = [e.clientX, e.clientY];
  }

  //  When the mouse is raised, we handle the click if it wasn't a part
  //  of a drag.
  handleMouseUp = (e) => {
    const { startXY } = this;
    const { onClick } = this.props;
    const { button, clientX, clientY, target } = e;

    //  This gets the change in mouse position. If `startXY` isn't set,
    //  it means that the click originated elsewhere.
    if (!startXY) return;
    const [ deltaX, deltaY ] = [clientX - startXY[0], clientY - startXY[1]];

    //  This switch prevents an overly lengthy if.
    switch (true) {

    //  If the button being released isn't the main mouse button, or if
    //  we don't have a click parsing function, or if the mouse has
    //  moved more than 5px, OR if the target of the mouse event is a
    //  button or a link, we do nothing.
    case button !== 0:
    case !onClick:
    case Math.sqrt(deltaX ** 2 + deltaY ** 2) >= 5:
    case (
      target.matches || target.msMatchesSelector || target.webkitMatchesSelector || (() => void 0)
    ).call(target, 'button, button *, a, a *'):
      break;

    //  Otherwise, we parse the click.
    default:
      onClick(e);
      break;
    }

    //  This resets our mouse location.
    this.startXY = null;
  }

  //  This expands and collapses our spoiler.
  handleSpoilerClick = (e) => {
    const { setExpansion } = this.props;
    e.preventDefault();
    if (setExpansion) {
      setExpansion();  //  Calling with no argument toggles
    }
  }

  //  Renders our component.
  render () {
    const {
      handleMouseDown,
      handleMouseUp,
      handleSpoilerClick,
    } = this;
    const {
      card,
      className,
      content,
      contentVisible,
      detailed,
      history,
      media,
      mentions,
      onClick,
      sensitive,
      small,
      spoiler,
      tags,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--STATUS--CONTENT', {
      actionable: !detailed && onClick,
      small,
      spoilered: !contentVisible,
    }, className);
    const mediaElement = function () {
      switch (true) {

      //  If we are `small`, we don't show media.
      case !!small:
        return null;

      //  If there aren't any media attachments, we try showing a card.
      case (!media || !media.size) && card:
        return <ConnectedCard card={card.get('id')} />;

      //  Otherwise, if there is an unknown attachment, we show an
      //  attachment list.
      case (media && media.some(
        item => item.get('type') === 'unknown'
      )):
        return <ConnectedStatusContentUnknown media={media} />;

      //  Otherwise, if there are attachments, we render them in a
      //  gallery.
      case !!media:
        return (
          <ConnectedStatusContentGallery
            media={media}
            sensitive={sensitive}
          />
        );
      default:
        return null;
      }
    }();

    //  Spoiler stuff.
    if (spoiler.length > 0) {

      //  This gets our list of mentions.
      const mentionLinks = mentions.map(
        mention => (
          <ConnectedReference
            history={history}
            mention={mention.get('id')}
            showAt
          />
        )
      ).reduce(
        (aggregate, item) => [...aggregate, ' ', item], []
      );

      //  Component rendering.
      return (
        <div className={computedClass}>
          <p
            className='spoiler'
            {...(onClick ? {
              onMouseDown: handleMouseDown,
              onMouseUp: handleMouseUp,
            } : {})}
          >
            <ConnectedParse
              text={spoiler}
              type='emoji'
            />
            {' '}
            <CommonButton
              active={!!contentVisible}
              className='showmore'
              onClick={handleSpoilerClick}
              showTitle={!contentVisible}
              title={ℳ.showMore}
            >
              {contentVisible ? ℳ.showLess : null}
            </CommonButton>
          </p>
          {!contentVisible ? mentionLinks : null}
          <div className='contents' hidden={!contentVisible}>
            <div
              className='text'
              {...(onClick ? {
                onMouseDown: handleMouseDown,
                onMouseUp: handleMouseUp,
              } : {})}
            >
              <ConnectedParse
                history={history}
                mentions={mentions}
                tags={tags}
                text={content}
                type='status'
              />
            </div>
            {mediaElement}
          </div>
        </div>
      );

    //  Non-spoiler statuses.
    } else {
      return (
        <div className={computedClass}>
          <div className='contents'>
            <div
              className='text'
              {...(onClick ? {
                onMouseDown: handleMouseDown,
                onMouseUp: handleMouseUp,
              } : {})}
            >
              <ConnectedParse
                history={history}
                mentions={mentions}
                tags={tags}
                text={content}
                type='status'
              />
            </div>
            {mediaElement}
          </div>
        </div>
      );
    }
  }

}
