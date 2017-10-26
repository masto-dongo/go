//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {
  CommonButton,
  ConnectedParse,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

export default class ConnectedPreviewStatus extends React.PureComponent {

  constructor (props) {
    super(props);
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
    const { handleSpoilerClick } = this;
    const {
      className,
      content,
      contentVisible,
      media,
      sensitive,
      spoiler,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--PREVIEW--STATUS', { spoilered: !contentVisible }, className);

    const mediaElement = function () {
      switch (true) {

      //  If there is an unknown attachment, we show an attachment
      //  list.
      case (media && media.some(
        item => item.get('type') === 'unknown'
      )):
        //return <ConnectedStatusContentUnknown media={media} />;
        return null;

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

ConnectedPreviewStatus.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string,
  contentVisible: PropTypes.bool,
  media: PropTypes.array,
  sensitive: PropTypes.bool,
  setExpansion: PropTypes.func,
  spoiler: PropTypes.string,
  ℳ: PropTypes.func.isRequired,
};
