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
import { createStructuredSelector } from 'reselect';

//  Component imports.
import {
  CommonImage,
  CommonLink,
  CommonSeparator,
  ConnectedParse,
} from 'themes/mastodon-go/components';
import ConnectedCardReference from './reference';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';
import { CARD_TYPE } from 'themes/mastodon-go/util/constants';
import { moduleOnReady } from 'themes/mastodon-go/util/module';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
function Card ({
  className,
  id,
  ℳ,
  '🏪': {
    author,
    description,
    href,
    html,
    image,
    provider,
    title,
    type,
  },
  '💪': handler,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--CONNECTED--CARD', className);

  //  This generates our card media (image or video).
  const media = function () {
    switch (type) {
    case CARD_TYPE.PHOTO:
      return (
        <CommonLink
          className='image'
          href={href}
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
          href={href}
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
              <ConnectedParse
                text={title}
                type='emoji'
              />
            </h1>
          ) : null}
          {description ? (
            <ConnectedParse
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
          <ConnectedCardReference
            className='author'
            href={author.get('href')}
            name={author.get('name')}
          />
          <CommonSeparator visible={author && provider} />
          <ConnectedCardReference
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
    <figure
      className={computedClass}
      {...rest}
    >
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
  ℳ: PropTypes.func,
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
  '💪': PropTypes.objectOf(PropTypes.func),
};

//  * * * * * * *  //

//  Connecting
//  ----------

var ConnectedCard;

//  Building our store.
moduleOnReady(function () {
  ConnectedCard = connect(

    //  Component.
    Card,

    //  Store.
    createStructuredSelector({
      author: (state, { id }) => state.getIn(['card', id, 'author']),
      description: (state, { id }) => state.getIn(['card', id, 'description']),
      href: (state, { id }) => state.getIn(['card', id, 'href']),
      html: (state, { id }) => state.getIn(['card', id, 'html']),
      image: (state, { id }) => state.getIn(['card', id, 'image']),
      provider: (state, { id }) => state.getIn(['card', id, 'provider']),
      title: (state, { id }) => state.getIn(['card', id, 'title']),
      type: (state, { id }) => state.getIn(['card', id, 'type']),
    })
  );
});

export { ConnectedCard as default };
