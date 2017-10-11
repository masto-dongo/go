//  <Card>
//  ======

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { ParseContainer } from 'themes/mastodon_go/components';

import {
  CommonLink,
  CommonSeparator,
} from 'themes/mastodon_go/components';

import CardReference from './reference';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------
export default class Card extends React.PureComponent {

  //  Props.
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    '🛄': PropTypes.shape({ intl: PropTypes.object }),
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

  //  Rendering.
  render () {
    const {
      className,
      id,
      '🛄': context,
      '💪': handler,
      '🏪': PropTypes.shape({
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
      }).isRequired,
    } = this.props;
    let media = null;
    let text = null;
    let caption = null;

    //  Sets our class.
    const computedClass = classNames('MASTODON_GO--CARD', className);

    //  This generates our card media (image or video).
    switch (type) {
    case 'photo':
      media = (
        <CommonLink
          className='image'
          href={url}
        >
          <img
            alt={title}
            src={image}
          />
        </CommonLink>
      );
      break;
    case 'video':
      media = (
        <div
          className='video'
          dangerouslySetInnerHTML={{ __html: html }}
          title={title}
        />
      );
      break;
    }

    //  If we have at least a title or a description, then we can
    //  render some textual contents.
    if (title || description) {
      text = (
        <CommonLink
          className='description'
          href={url}
        >
          {type === 'link' && image ? (
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
    }

    //  If we have either the author or the provider, then we can
    //  render a caption.
    if (author || provider) {
      caption = (
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
    }

    //  Putting the pieces together and returning.
    return (
      <figure className={computedClass}>
        {media}
        {text}
        {caption}
      </figure>
    );
  }

}
