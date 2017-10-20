/*********************************************************************\
|                                                                     |
|   <AttachmentImage>                                                 |
|   =================                                                 |
|                                                                     |
|   They're images!  What more is there to say?!                      |
|                                                                     |
|   `targetWidth` is used to create `srcSet` and `sizes` attributes   |
|   which mean that the correct image size for your environment can   |
|   (hopefully) always be selected.  The image is wrapped in a link   |
|   to its original source, which doubles as a button to open it up   |
|   in the UI, fullsize.                                              |
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

//  Common imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ConnectedAttachmentImage ({
  className,
  description,
  href,
  onClick,
  preview,
  src,
  targetWidth,
  width,
  ℳ,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--CONNECTED--ATTACHMENT--IMAGE', className);
  let srcSet;
  let sizes;

  //  This lets the browser conditionally select the preview or
  //  original image depending on what the rendered size ends up
  //  being. (Note: Upstream Mastodon used media queries here, but
  //  because our page layout is user-configurable, we don't bother.)
  if (width && targetWidth) {
    srcSet = `${src} ${width}w, ${preview.get('src')} ${preview.get('width')}w`;
    sizes = `${targetWidth}px`;
  }

  //  We render the image inside of a linky button, which provides the
  //  original.
  return (
    <CommonButton
      className={computedClass}
      href={href || src}
      onClick={onClick}
      title={ℳ.imageExpand}
      {...rest}
    >
      <img
        alt={description}
        sizes={sizes}
        src={preview.get('src')}
        srcSet={srcSet}
        title={description}
      />
    </CommonButton>
  );
}

//  Props.
ConnectedAttachmentImage.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  preview: ImmutablePropTypes.map,
  src: PropTypes.string,
  targetWidth: PropTypes.number,
  width: PropTypes.number,
  ℳ: PropTypes.func.isRequired,
};
