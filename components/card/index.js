/*********************************************************************\
|                                                                     |
|   <Card>                                                            |
|   ======                                                            |
|                                                                     |
|   Cards are stored in redux by status, so `id` refers to a status   |
|   `id` and not some other kind of identifier.  All of the rest of   |
|   our card information is pulled in from the store.                 |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

//  Container imports.
import { ParseContainer } from 'themes/mastodon-go/components';

//  Component imports.
import CardReference from './reference';

//  Common imports.
import {
  CommonLink,
  CommonSeparator,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  Other imports.
import { CARD_TYPE } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function Card ({
  className,
  id,
  '🛄': context,
  '💪': handler,
  '🏪': {
    author,
    description,
    height,
    href,
    html,
    image,
    provider,
    rainbow,
    title,
    type,
    width,
  },
}) {
  const computedClass = classNames('MASTODON_GO--CARD', className);

  //  This generates our card media (image or video).
  const media = function () {
    switch (type) {
    case CARD_TYPE.PHOTO:
      return (
        <CommonLink
          className='image'
          href={url}
        >
          <CommonImage
            alt={title}
            staticSrc={image}
          />
        </CommonLink>
      );
    case CARD_TYPE.VIDEO:
      return (
        <div
          className='video'
          dangerouslySetInnerHTML={{ __html: html }}
          title={title}
        />
      );
    default:
      return null;
    }
  }();

  //  If we have at least a title or a description, then we can
  //  render some textual contents.
  const text = function () {
    if (title || description) {
      return (
        <CommonLink
          className='description'
          href={url}
        >
          {type === CARD_TYPE.LINK && image ? (
            <img
              alt=''
              className='thumbnail'
              src={image}
            />
          ) : null}
          {title ? (
            <h1>
              <ParseContainer
                text={title}
                type='emoji'
              />
            </h1>
          ) : null}
          {description ? (
            <ParseContainer
              text={description}
              type='emoji'
            />
          ) : null}
        </CommonLink>
      );
    } else {
      return null;
    }
  }();

  //  If we have either the author or the provider, then we can
  //  render a caption.
  const caption = function () {
    if (author || provider) {
      return (
        <figcaption>
          <CardReference
            className='author'
            href={author.get('href')}
            name={author.get('name')}
          />
          <CommonSeparator visible={author && provider} />
          <CardReference
            className='provider'
            href={provider.get('href')}
            name={provider.get('name')}
          />
        </figcaption>
      );
    } else {
      return null;
    }
  }();

  //  Putting the pieces together and returning.
  return (
    <figure className={computedClass}>
      {media}
      {text}
      {caption}
    </figure>
  );
}

//  Props.
Card.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  '🛄': PropTypes.shape({}),
  '💪': PropTypes.objectOf(PropTypes.func),
  '🏪': PropTypes.shape({
    author: ImmutablePropTypes.map,
    description: PropTypes.string,
    height: PropTypes.number,
    href: PropTypes.string,
    html: PropTypes.string,
    image: PropTypes.string,
    provider: ImmutablePropTypes.map,
    rainbow: ImmutablePropTypes.map,
    title: PropTypes.string,
    type: PropTypes.number.isRequired,
    width: PropTypes.number,
  }).isRequired,
}
