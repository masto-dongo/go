//  <Reference>
//  ===========

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';

//  Common imports.
import {
  CommonButton,
  CommonLink,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  Other imports.
import { MEDIA_TYPE } from 'themes/mastodon-go/util/constants';

const messages = defineMessages({
  card: {
    defaultMessage: 'Card',
    id: 'reference.card',
  },
  hashtag: {
    defaultMessage: 'Hashtag #{tagName}',
    id: 'reference.hashtag',
  },
  image: {
    defaultMessage: 'Image',
    id: 'reference.image',
  },
  unknown: {
    defaultMessage: 'Unknown attachment',
    id: 'reference.unknown',
  },
  video: {
    defaultMessage: 'Video',
    id: 'reference.video',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

export default class Reference extends React.PureComponent {

  static propTypes = {
    at: PropTypes.string,
    attachment: PropTypes.string,
    card: PropTypes.string,
    className: PropTypes.string,
    domain: PropTypes.string,
    handler: PropTypes.objectOf(PropTypes.func).isRequired,
    history: PropTypes.object,
    href: PropTypes.string,
    intl: PropTypes.object.isRequired,
    location: PropTypes.object,  //  Not updated; don't use
    match: PropTypes.object,  //  Not updated; don't use
    mediaType: PropTypes.number,
    mention: PropTypes.string,
    rainbow: ImmutablePropTypes.map,
    showAt: PropTypes.bool,
    showHash: PropTypes.bool,
    staticContext: PropTypes.object,  //  Don't use
    tagName: PropTypes.string,
    title: PropTypes.string,
  }

  constructor (props) {
    super(props)
    const { handler: { fetch } } = props;
    fetch();
  }

  render () {
    const {
      at,
      attachment,
      card,
      className,
      domain,
      handler,
      history,
      href,
      intl,
      location,
      match,
      mediaType,
      mention,
      rainbow,
      showAt,
      showHash,
      staticContext,
      tagName,
      title,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--REFERENCE', className);
    return (
      <span
        className={computedClass}
        style={rainbow ? { color: rainbow.get('1') } : {}}
        {...rest}
      >
        {(
          () => {
            let defaultTitle = '';
            let icon = '';
            switch (true) {
            case !!attachment:
              switch (mediaType) {
              case MEDIA_TYPE.GIFV:
              case MEDIA_TYPE.IMAGE:
                defaultTitle = intl.formatMessage(messages.image);
                icon = 'picture-o';
                break;
              case MEDIA_TYPE.VIDEO:
                defaultTitle = intl.formatMessage(messages.video);
                icon = 'video-camera';
                break;
              default:
                defaultTitle = intl.formatMessage(messages.unknown);
                icon = 'question';
                break;
              }
              return (
                <CommonButton
                  className='attachment'
                  href={href}
                  icon={icon}
                  style={rainbow ? { backgroundImage: `linear-gradient(160deg, ${rainbow.get('3').join(', ')})` } : {}}
                  title={title || defaultTitle}
                />
              );
            case !!card:
              return (
                <CommonButton
                  className='card'
                  href={href}
                  icon={'id-card-o'}
                  style={rainbow ? { backgroundImage: `linear-gradient(160deg, ${rainbow.get('3').join(', ')})` } : {}}
                  title={title || intl.formatMessage(messages.card)}
                />
              );
            case !!mention:
              return (
                <CommonLink
                  className='mention'
                  destination={`/profile/${mention}`}
                  history={history}
                  href={href}
                  title={title}
                >
                  {showAt && username ? <span className='at'>@</span> : null}
                  <span className='username'>{username || mention}</span>
                </CommonLink>
              );
            case !!tagName:
              return (
                <CommonLink
                  className='tag'
                  destination={`/tagged/${tagName}`}
                  history={history}
                  href={href}
                  title={intl.formatMessage(messages.hashtag, { tagName })}
                >
                  {showHash ? <span className='hash'>#</span> : null}
                  <span className='tagname'>{tagName}</span>
                </CommonLink>
              );
            default:
              return null;
            }
          }
        )()}
      </span>
    );
  }

}
