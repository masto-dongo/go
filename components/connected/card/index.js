//  <ConnectedCard>
//  ===============

//  Cards are stored in redux by status, so `id` refers to a status
//  `id` and not some other kind of identifier.  All of the rest of
//  our card information is pulled in from the store.

//  * * * * * * *  //

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
} from 'flavours/go/components';
import ConnectedCardReference from './reference';

//  Lib imports.
import connect from 'flavours/go/lib/connect';
import {
  CARD_TYPE,
  fetchCard,
} from 'flavours/go/lib/tootledge';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
class Card extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);
    const { '💪': { fetch } } = this.props;

    //  We need to fetch our card if we don't have it.
    fetch();
  }

  //  If our `id` is about to change, we need to fetch the new card.
  componentWillReceiveProps (nextProps) {
    const {
      id,
      '💪': { fetch },
    } = this.props;
    if (id !== nextProps.id) {
      fetch(nextProps.id);
    }
  }

  //  Rendering.
  render () {
    const {
      className,
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
    } = this.props;
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

    //  Rendering.
    return media || text || caption ? (
      <figure className={computedClass}>
        {media}
        {text}
        {caption}
      </figure>
    ) : null;
  }

}

//  Props.
Card.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,  //  The id of the card's status
  '🏪': PropTypes.shape({
    author: ImmutablePropTypes.map,  //  Author information for the card
    description: PropTypes.string,  //  The card description
    href: PropTypes.string,  //  The card's link
    html: PropTypes.string,  //  HTML content for the card
    image: PropTypes.string,  //  The card's associated image
    provider: ImmutablePropTypes.map,  //  The provider of the card
    title: PropTypes.string,  //  The title of the card
    type: PropTypes.number,  //  A `CARD_TYPE`
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

var ConnectedCard = connect(

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
  }),

  //  Messages.
  null,

  //  Handlers.
  (go, store, { id }) => ({
    fetch: (newId = id) => go(fetchCard, newId, false),
  })
);

export { ConnectedCard as default };
