//  <ConnectedPreviewStatus>
//  ========================

//  This component renders a preview of the status that will be
//  submitted from the composer.  It's pretty rough right now—see
//  Issue #21.

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
  CommonButton,
  ConnectedParse,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class ConnectedPreviewStatus extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  Function binding.
    const { handleSpoilerClick } = Object.getPrototypeOf(this);
    this.handleSpoilerClick = handleSpoilerClick.bind(this);
  }

  //  This expands and collapses our spoiler.
  handleSpoilerClick () {
    const { onExpansion } = this.props;
    if (onExpansion) {
      onExpansion();  //  Calling with no argument toggles
    }
  }

  //  Renders our component.
  render () {
    const { handleSpoilerClick } = this;
    const {
      className,
      content,
      contentVisible,
      emoji,
      media,
      //sensitive,
      spoiler,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--PREVIEW--STATUS', { spoilered: !contentVisible }, className);

    //  This is the media element that goes with our status.
    const mediaElement = function () {
      switch (true) {

      //  If there is an unknown attachment, we show an attachment
      //  list.
      //case (media && media.some(
      //  item => item.get('type') === 'unknown'
      //)):
        //return <ConnectedStatusContentUnknown media={media} />;

      //  Otherwise, if there are attachments, we render them in a
      //  gallery.
      case !!media:
        //return (
        //  <ConnectedStatusContentGallery
        //    media={media}
        //    sensitive={sensitive}
        //  />
        //);
        return null;

      default:
        return null;
      }
    }();

    //  Spoiler stuff.
    if (spoiler.length > 0) {

      //  Component rendering.
      return (
        <div className={computedClass}>
          <p className='spoiler'>
            <ConnectedParse
              emoji={emoji}
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
          <div className='contents' hidden={!contentVisible}>
            <div className='text'>
              <ConnectedParse
                emoji={emoji}
                text={content.trim().replace(/\n{2,}/g, '\n\n')}
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
            <div className='text'>
              <ConnectedParse
                emoji={emoji}
                text={content.trim().replace(/\n{2,}/g, '\n\n')}
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
ConnectedPreviewStatus.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string,  //  The content of the status
  contentVisible: PropTypes.bool,  //  Whether the status content is visible
  emoji: ImmutablePropTypes.list,  //  A list of custom emoji for the status
  media: PropTypes.array,  //  The status media
  onExpansion: PropTypes.func,  //  A function to set the expansion of the status
  sensitive: PropTypes.bool,  //  `true` if the status contains sensitive media
  spoiler: PropTypes.string,  //  The contents of the status spoiler
  ℳ: PropTypes.func.isRequired,
};
