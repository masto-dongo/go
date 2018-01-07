//  <ConnectedStatusContent>
//  ========================

//  This component renders the status content.  For the most part, we
//  hand this over to `<ConnectedParse>`, but we do need to render
//  media and spoilers ourselves.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

//  Component imports.
import {
  CommonTextButton,
  ConnectedCard,
  ConnectedParse,
  ConnectedReference,
} from 'flavours/go/components';
import ConnectedStatusContentGallery from './gallery';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class ConnectedStatusContent extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  Variables.
    this.startXY = null;

    //  Function binding.
    const {
      handleMouseDown,
      handleMouseUp,
    } = Object.getPrototypeOf(this);
    this.handleMouseDown = handleMouseDown.bind(this);
    this.handleMouseUp = handleMouseUp.bind(this);
  }

  //  When the mouse is pressed down, we grab its position.
  handleMouseDown ({
    clientX,
    clientY,
  }) {
    this.startXY = [clientX, clientY];
  }

  //  When the mouse is raised, we handle the click if it wasn't a part
  //  of a drag.
  handleMouseUp (e) {
    const { startXY } = this;
    const { onDetail } = this.props;
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
    case !onDetail:
    case Math.sqrt(deltaX ** 2 + deltaY ** 2) >= 5:
    case (
      target.matches || target.msMatchesSelector || target.webkitMatchesSelector || (() => false)
    ).call(target, 'button, button *, a, a *'):
      break;

    //  Otherwise, we parse the click.
    default:
      onDetail(e);
      break;
    }

    //  This resets our mouse location.
    this.startXY = null;
  }

  //  Rendering.
  render () {
    const {
      handleMouseDown,
      handleMouseUp,
    } = this;
    const {
      card,
      className,
      content,
      contentVisible,
      detailed,
      emoji,
      id,
      media,
      mentions,
      onDetail,
      onExpansion,
      sensitive,
      small,
      spoiler,
      tags,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--STATUS--CONTENT', {
      actionable: !detailed && onDetail,
      small,
      spoilered: !contentVisible,
    }, className);
    const mediaElement = function () {
      switch (true) {

      //  If we are `small`, we don't show media.
      case !!small:
        return null;

      //  If there aren't any media attachments and our status is
      //  detailed, we try showing a card.
      case !(media && media.size) && detailed:
        return <ConnectedCard id={id} />;

      //  Otherwise, if there are attachments, we render them in a
      //  gallery.
      case !!(media && media.size):
        return (
          <ConnectedStatusContentGallery
            media={media}
            sensitive={sensitive}
            ℳ={ℳ}
          />
        );

      //  If we don't have any media, we can't render any.
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
            {...(onDetail ? {
              onMouseDown: handleMouseDown,
              onMouseUp: handleMouseUp,
            } : {})}
          >
            <ConnectedParse
              emoji={emoji}
              text={spoiler}
              type='emoji'
            />
            {' '}
            <CommonTextButton
              active={!!contentVisible}
              className='showmore'
              onClick={onExpansion}
              showTitle={!contentVisible}
              title={ℳ.showMore}
            >
              {contentVisible ? ℳ.showLess : ℳ.showMore}
            </CommonTextButton>
          </p>
          {!contentVisible ? mentionLinks : null}
          <div className='contents' hidden={!contentVisible}>
            <div
              className='text'
              {...(onDetail ? {
                onMouseDown: handleMouseDown,
                onMouseUp: handleMouseUp,
              } : {})}
            >
              <ConnectedParse
                attachments={media}
                card={(!media || !media.size) && detailed && card || null}
                emoji={emoji}
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
              {...(onDetail ? {
                onMouseDown: handleMouseDown,
                onMouseUp: handleMouseUp,
              } : {})}
            >
              <ConnectedParse
                attachments={media}
                card={(!media || !media.size) && detailed && card || null}
                emoji={emoji}
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

//  Props.
ConnectedStatusContent.propTypes = {
  card: ImmutablePropTypes.map,  //  The status card
  className: PropTypes.string,
  content: PropTypes.string,  //  The content of the status
  contentVisible: PropTypes.bool,  //  `true` if the spoiler is expanded and content is visible
  detailed: PropTypes.bool,  //  `true` if the status is detailed
  emoji: ImmutablePropTypes.list,  //  A list of custom emoji for the status
  media: ImmutablePropTypes.list,  //  A list of media attachments for the status
  mentions: ImmutablePropTypes.list,  //  A list of mentions for the status
  id: PropTypes.string,  //  The id of the status
  onDetail: PropTypes.func,  //  A function to call when making the status content detailed
  onExpansion: PropTypes.func,  //  A function to call when expanding the spoiler
  sensitive: PropTypes.bool,  //  `true` if the status contains sensitive media
  small: PropTypes.bool,  //  `true` if the status is small
  spoiler: PropTypes.string,  //  The status spoiler
  tags: ImmutablePropTypes.list,  // A list of tags for the status
  ℳ: PropTypes.func.isRequired,
};
