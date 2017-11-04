//  <ConnectedMediaImage>
//  =====================
//
//  `targetWidth` is used to create `srcSet` and `sizes` attributes,
//  which mean that the correct image size for your environment can
//  (hopefully) always be selected.  The image is wrapped in a link
//  to its original source, which doubles as a button to open it up
//  in the UI, fullsize.

//  * * * * * * *  //

//  Imports:
//  --------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ConnectedAttachmentImage ({
  className,
  description,
  href,
  onClick,
  previewSrc,
  previewWidth,
  src,
  targetWidth,
  width,
  ℳ,
}) {
  const computedClass = classNames('MASTODON_GO--CONNECTED--MEDIA--IMAGE', className);
  let srcSet;
  let sizes;

  //  This lets the browser conditionally select the preview or
  //  original image depending on what the rendered size ends up
  //  being.
  if (width && previewWidth) {
    srcSet = `${src} ${width}w, ${previewSrc} ${previewWidth}w`;
    if (targetWidth) {
      sizes = `${targetWidth}px`;
    }
  }

  //  We render the image inside of a linky button, which provides the
  //  original.  We don't bother with `<CommonImage>` here because we
  //  know our image is static (and this gives us easier access to the
  //  `sizes` and `srcSet` attributes).
  return (
    <div className={computedClass}>
      <CommonButton
        href={href || src}
        onClick={onClick}
        title={ℳ.imageExpand}
      >
        <img
          alt={description}
          sizes={sizes}
          src={previewSrc}
          srcSet={srcSet}
          title={description}
        />
      </CommonButton>
    </div>
  );
}

//  Props.
ConnectedAttachmentImage.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,  //   A label (alt-text) for the image
  href: PropTypes.string,  //  The URL of the original image source
  onClick: PropTypes.func,  //  A function to call when clicking the image
  previewSrc: PropTypes.string,  //  The source of the preview image
  previewWidth: PropTypes.number,  //  The width of the preview image
  src: PropTypes.string,  //  The source of the image
  targetWidth: PropTypes.number,  //  The target width for the image
  width: PropTypes.number,  //  The width of the image
  ℳ: PropTypes.func.isRequired,
};
