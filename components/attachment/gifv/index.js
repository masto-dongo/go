//  <AttachmentGifv>
//  ================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports:
//  --------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';

//  Our imports.
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

export default class AttachmentGifv extends React.PureComponent {

  //  Props.
  static propTypes = {
    autoplay: PropTypes.bool,
    className: PropTypes.string,
    description: PropTypes.string,
    href: PropTypes.string,
    intl: PropTypes.object.isRequired,
    preview: ImmutablePropTypes.map,
    src: PropTypes.string,
  };

  //  Item rendering.
  render () {
    const {
      autoplay,
      className,
      description,
      href,
      intl,
      preview,
      src,
      ...rest
    } = this.props;

    const computedClass = classNames('MASTODON_GO--ATTACHMENT--GIFV', className);

    //  Rendering. We render the item inside of a button+link, which
    //  provides the original. (We can do this for gifvs because we
    //  don't show the controls.)
    return (
      <CommonButton
        className={computedClass}
        href={href || src}
        title={intl.formatMessage(messages.expand)}
        {...rest}
      >
        <video
          autoPlay={autoPlay}
          loop
          muted
          poster={preview.get('src')}
          src={src}
          title={description}
        />
      </CommonButton>
    );
  }

}
