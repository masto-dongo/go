//  <UI>
//  ====

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Request imports.
import {
  loadMeta,
  submitStatus,
} from 'themes/mastodon-go/redux';

import RoutedUIColumn from './column';
import RoutedUIModal from './modal';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';
import uuid from 'themes/mastodon-go/util/uuid';

class UI extends React.Component {  //  Impure

  static propTypes = {
    className: PropTypes.string,
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    staticContext: PropTypes.object,  //  Unused
    ℳ: PropTypes.func.isRequired,
    '🏪': PropTypes.shape({ defaultVisibility: PropTypes.number }).isRequired,
    '💪': PropTypes.objectOf(PropTypes.func).isRequired,
  };

  constructor (props) {
    super(props);
    const {
      '🏪': { defaultVisibility },
      '💪': { fetch },
    } = props;

    //  State.
    this.state = {
      idempotency: uuid(),
      media: [],
      spoiler: '',
      text: '\n',
      visibility: defaultVisibility,
    };

    //  Function binding.
    const {
      handleClear,
      handleMediaRemove,
      handleSensitive,
      handleSpoiler,
      handleSubmit,
      handleText,
      handleVisibility,
    } = Object.getPrototypeOf(this);
    this.handleClear = handleClear.bind(this);
    this.handleMediaRemove = handleMediaRemove.bind(this);
    this.handleSensitive = handleSensitive.bind(this);
    this.handleSpoiler = handleSpoiler.bind(this);
    this.handleSubmit = handleSubmit.bind(this);
    this.handleText = handleText.bind(this);
    this.handleVisibility = handleVisibility.bind(this);

    //  Fetching.
    fetch();
  }

  componentWillReceiveProps (nextProps) {
    const {
      '🏪': { defaultVisibility },
    } = this.props;
    const {
      media,
      spoiler,
      text,
    } = this.state;
    if (defaultVisibility !== nextProps['🏪'].defaultVisibility && !media.length && !spoiler && (!text || text === '\n')) {
      this.setState({ visibility: nextProps['🏪'].defaultVisibility });
    }
  }

  handleClear () {
    const { '🏪' : { defaultVisibility } } = this.props;
    this.setState({
      idempotency: uuid(),
      inReplyTo: null,
      media: [],
      sensitive: false,
      spoiler: '',
      storedHash: '#',
      text: '\n',
      visibility: defaultVisibility,
    });
  }

  handleMediaRemove (id) {
    const { media } = this.state;
    this.setState({
      idempotency: uuid(),
      media: media.filter(
        mediaId => mediaId !== id
      ),
    });
  }
  handleSubmit () {
    const { '💪': { submit } } = this.props;
    const {
      idempotency,
      inReplyTo,
      media,
      sensitive,
      spoiler,
      text,
      visibility,
    } = this.state;
    if (submit) {
      submit(text, {
        idempotency,
        inReplyTo,
        media,
        sensitive,
        spoiler,
        visibility,  //  TK: Handle this enum properly in the redux
      });
    }
  }
  handleSpoiler (spoiler) {
    this.setState({
      idempotency: uuid(),
      spoiler,
    });
  }
  handleText (text) {
    this.setState({
      idempotency: uuid(),
      text,
    });
  }
  handleSensitive (value) {
    const { sensitive } = this.state;
    this.setState({
      idempotency: uuid(),
      sensitive: value === void 0 ? !sensitive : !!value,
    });
  }
  handleVisibility (value) {
    this.setState({
      idempotency: uuid(),
      visibility: value,
    });
  }

  //  TK: Drag and Drop API

  //  TK: Push notificaitons

  render () {
    const {
      handleClear,
      handleMediaRemove,
      handleSensitive,
      handleSpoiler,
      handleSubmit,
      handleText,
      handleVisibility,
    } = this;
    const {
      className,
      history,
      location,
      match,
      staticContext,
      ℳ,
      '🏪': store,
      '💪': handler,
      ...rest
    } = this.props;
    const {
      media,
      spoiler,
      text,
      visibility,
    } = this.state;

    const computedClass = classNames('MASTODON_GO--ROUTED--UI', className);

    const singleColumn = true;  //  for now
    const columns = { size: 0 };  //  for now

    return (
      <div
        className={computedClass}
        {...rest}
      >
        <RoutedUIModal history={history} />
        <RoutedUIColumn
          activeRoute
          history={history}
          index={!singleColumn ? columns.size : 0}
          location={location}
          media={media}
          onClear={handleClear}
          onMediaRemove={handleMediaRemove}
          onSensitive={handleSensitive}
          onSpoiler={handleSpoiler}
          onSubmit={handleSubmit}
          onText={handleText}
          onVisibility={handleVisibility}
          singleColumn={singleColumn}
          spoiler={spoiler}
          text={text}
          visibility={visibility}
          ℳ={ℳ}
        />
      </div>
    );
  }

}

//  * * * * * * *  //

//  Connecting
//  ----------

//  Selector factory.
export default connect(

  //  Component.
  UI,

  //  Store.
  createStructuredSelector({
    defaultVisibility: state => state.getIn(['meta', 'defaultVisibility']),
  }),

  //  Messages.
  defineMessages({
    global: {
      defaultMessage: 'Federated timeline',
      description: 'Used as the title for global timelines',
      id: 'timeline.global',
    },
    home: {
      defaultMessage: 'Home',
      description: 'Used as the title for home timelines',
      id: 'timeline.home',
    },
    local: {
      defaultMessage: 'Local timeline',
      description: 'Used as the title for local timelines',
      id: 'timeline.local',
    },
    localTag: {
      defaultMessage: '{query} (local)',
      description: 'Used as the title for local hashtag timelines',
      id: 'timeline.local_tag',
    },
  }),

  //  Handler.
  go => ({
    fetch: () => go(loadMeta),
    submit: (text, options) => go(submitStatus, text, options),
  })
);
