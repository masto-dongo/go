//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  defineMessages,
  FormattedMessage,
} from 'react-intl';

//  Component imports.
import DrawerComposer from './composer';
import DrawerMenu from './menu';
import DrawerSearch from './search';

//  Common imports.
import { CommonPaneller } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  Other imports.
import { Emojifier } from 'themes/mastodon-go/util/emojify';
import uuid from 'themes/mastodon-go/util/uuid';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  drawer: {
    defaultMessage: 'Compose',
    id: 'drawer.drawer',
  },
  search: {
    defaultMessage: 'Search',
    id: 'drawer.search',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class Drawer extends React.PureComponent {

  //  Props.
  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    hash: PropTypes.string,
    history: PropTypes.object,
    inReplyTo: PropTypes.number,
    onClear: PropTypes.func,
    '🛄': PropTypes.shape({ intl: PropTypes.object.isRequired }).isRequired,
    '💪': PropTypes.objectOf(PropTypes.func),
    '🏪': PropTypes.shape({
      defaultSpoiler: PropTypes.string,
      defaultVisibility: PropTypes.number,
      emojos: ImmutablePropTypes.list.isRequired,
      me: PropTypes.string,
    }).isRequired,
  }
  state = {
    idempotency: uuid(),
    media: [],
    spoiler: this.props.defaultSpoiler || '',
    storedHash: '#',
    text: '\n',
    visibility: this.props.defaultVisibility,
  };
  emoji = (
    new Emojifier(this.props['🏪'].emojos && this.props['🏪'].emojos.toJS() || [])
  ).emoji;

  //  If our component is suddenly no longer the active route, we need
  //  to store its hash value before it disappears.  We also check for
  //  the unlikely event of changes to our `emojos`.
  componentWillReceiveProps (nextProps) {
    const {
      activeRoute,
      hash,
      '🏪': { emojos },
    } = this.props;
    if (activeRoute && !nextProps.activeRoute) {
      this.setState({ storedHash: hash });
    }
    if (emojos !== nextProps['🏪'].emojos) {
      this.emoji = (
        new Emojifier(nextProps['🏪'].emojos && nextProps['🏪'].emojos.toJS() || [])
      ).emoji;
    }
  }

  handleClear = () => {
    const {
      defaultSpoiler,
      defaultVisibility,
      onClear,
    } = this.props;
    this.setState({
      idempotency: uuid(),
      media: [],
      sensitive: false,
      spoiler: defaultSpoiler || '',
      storedHash: '#',
      text: '\n',
      visibility: defaultVisibility,
    });
    onClear();
  }

  handleMediaRemove = id => {
    const { media } = this.state;
    this.setState({
      idempotency: uuid(),
      media: media.filter(
        mediaId => mediaId !== id
      ),
    });
  };
  handleSubmit = () => {
    const {
      inReplyTo,
      '💪': { submit },
    } = this.props;
    const {
      idempotency,
      media,
      sensitive,
      spoiler,
      text,
      visibility,
    } = this.state;
    if (onSubmit) {
      onSubmit(text, {
        idempotency,
        inReplyTo,
        media,
        sensitive,
        spoiler,
        visibility,  //  TK: Handle this enum properly in the redux
      });
    }
  };
  handleSpoiler = spoiler => {
    this.setState({
      idempotency: uuid(),
      spoiler,
    });
  };
  handleText = text => {
    this.setState({
      idempotency: uuid(),
      text,
    });
  };

  handleSensitive = value => {
    const { sensitive } = this.state;
    this.setState({
      idempotency: uuid(),
      sensitive: value === void 0 ? !sensitive : !!value,
    });
  };
  handleVisibility = value => {
    this.setState({
      idempotency: uuid(),
      visibility: value,
    });
  };

  //  This is a tiny function to update our hash if needbe.
  handleSetHash = hash => {
    const { activeRoute } = this;
    if (!activeRoute) {
      this.setState({ storedHash: hash });
    }
  }

  //  Rendering.
  render () {
    const {
      emoji,
      handleClear,
      handleMediaRemove,
      handleSensitive,
      handleSetHash,
      handleSpoiler,
      handleSubmit,
      handleText,
      handleVisibility,
    } = this;
    const {
      activeRoute,
      className,
      hash,
      history,
      inReplyTo,
      '🛄': { intl },
      '💪': { upload },
      '🏪': { me },
      ...rest
    } = this.props;
    const {
      media,
      sensitive,
      storedHash,
      spoiler,
      text,
      visibility,
    } = this.state;
    const computedClass = classNames('MASTODON_GO--DRAWER', className);

    //  We only use our internal hash if this isn't the active route.
    const computedHash = activeRoute ? hash : storedHash;

    return (
      <CommonPaneller
        className={computedClass}
        menu={
          <DrawerMenu
            activeRoute={activeRoute}
            hash={computedHash}
            history={history}
            intl={intl}
            onSetHash={handleSetHash}
          />
        }
        panel={function () {
          switch (hash) {
          case '#preview':
            return (
              <DrawerPreview
                activeRoute={activeRoute}
                emoji={emoji}
                history={history}
                inReplyTo={inReplyTo}
                intl={intl}
                media={media}
                onSensitive={handleSensitive}
                onSetHash={handleSetHash}
                onSpoiler={handleSpoiler}
                onSubmit={handleSubmit}
                onVisibility={handleVisibility}
                spoiler={spoiler}
                sensitive={sensitive}
                text={text}
                visibility={visibility}
              />
            );
          default:
            return null;
          }
        }()}
        title={<FormattedMessage {...messages.drawer} />}
        {...rest}
      >
        <DrawerComposer
          activeRoute={activeRoute}
          emoji={emoji}
          history={history}
          inReplyTo={inReplyTo}
          intl={intl}
          me={me}
          media={media}
          onClear={handleClear}
          onMediaRemove={handleMediaRemove}
          onSensitive={handleSensitive}
          onSetHash={handleSetHash}
          onSpoiler={handleSpoiler}
          onSubmit={handleSubmit}
          onText={handleText}
          onUpload={upload}
          sensitive={sensitive}
          spoiler={spoiler}
          text={text}
          visibility={visibility}
        />
      </CommonPaneller>
    );
  }

}
