/*********************************************************************\
|                                                                     |
|   <AttachmentGifv>                                                  |
|   ================                                                  |
|                                                                     |
|   GIFVs are just videos which look like images.  If `autoplay` is   |
|   set to `false`, you have to hover your mouse over them in order   |
|   to get them to play.                                              |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports:
//  --------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';

//  Common imports.
import { CommonButton } from 'themes/mastodon_go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  expand: {
    defaultMessage: 'Expand image',
    id: 'attachment.expand',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class AttachmentGifv extends React.PureComponent {

  //  Props.
  static propTypes = {
    autoplay: PropTypes.bool,
    className: PropTypes.string,
    description: PropTypes.string,
    href: PropTypes.string,
    intl: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    preview: ImmutablePropTypes.map,
    src: PropTypes.string,
  };

  //  This starts playing the GIFV on hover.
  handleMouseEnter ({ target }) {
    const { autoplay } = this.props;
    if (!autoplay) target.play();
  }

  //  When we stop playing, we also reset the time to the beginning.
  handleMouseLeave ({ target }) {
    const { autoplay } = this.props;
    if (!autoplay) {
      target.pause();
      target.currentTime = 0;
    }
  }

  //  Rendering.
  render () {
    const {
      handleMouseEnter,
      handleMouseLeave,
    } = this;
    const {
      autoplay,
      className,
      description,
      href,
      intl,
      onClick,
      preview,
      src,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--ATTACHMENT--GIFV', className);

    //  We render the gifv inside of a linky button, which provides
    //  provides the original. (We can only do this with a video
    //  because we don't show the controls.)
    return (
      <CommonButton
        className={computedClass}
        href={href || src}
        onClick={onClick}
        title={intl.formatMessage(messages.expand)}
        {...rest}
      >
        <video
          autoPlay={autoPlay}
          loop
          muted
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          poster={preview.get('src')}
          src={src}
          title={description}
        />
      </CommonButton>
    );
  }

}
