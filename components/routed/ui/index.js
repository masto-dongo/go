//  <UI>
//  ====

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  DOM imports.
import {
  DOMEventAttach,
  DOMEventCompose,
  DOMEventNavigate,
  DOMForget,
  DOMListen,
} from 'themes/mastodon-go/DOM';

//  Request imports.
import {
  loadMeta,
  submitStatus,
} from 'themes/mastodon-go/redux';

//  Component imports.
import RoutedUIColumn from './column';
import RoutedUIModal from './modal';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';
import { VISIBILITY } from 'themes/mastodon-go/util/constants';
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
      handleAttach,
      handleCompose,
      handleMediaRemove,
      handleNavigate,
      handleSensitive,
      handleSpoiler,
      handleSubmit,
      handleText,
      handleVisibility,
    } = Object.getPrototypeOf(this);
    this.handleAttach = handleAttach.bind(this);
    this.handleCompose = handleCompose.bind(this);
    this.handleMediaRemove = handleMediaRemove.bind(this);
    this.handleNavigate = handleNavigate.bind(this);
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

  componentWillMount () {
    const {
      handleAttach,
      handleCompose,
      handleNavigate,
    } = this;
    DOMListen(DOMEventAttach, handleAttach);
    DOMListen(DOMEventCompose, handleCompose);
    DOMListen(DOMEventNavigate, handleNavigate);
  }
  componentWillUnmount () {
    const {
      handleAttach,
      handleCompose,
      handleNavigate,
    } = this;
    DOMForget(DOMEventAttach, handleAttach);
    DOMForget(DOMEventCompose, handleCompose);
    DOMForget(DOMEventNavigate, handleNavigate);
  }

  handleAttach ({ detail: { id } }) {
    const { media } = this.state;
    if (media.length < 4) {
      this.setState({
        idempotency: uuid(),
        media: media.concat('' + id),
      });
    }
    DOMEventNavigate('/compose');
  }

  handleCompose ({ detail }) {
    const { '🏪' : { defaultVisibility } } = this.props;
    this.setState({
      idempotency: uuid(),
      inReplyTo: '' + detail.inReplyTo || null,
      media: [],
      sensitive: false,
      spoiler: '' + detail.spoiler || '',
      text: '' + detail.text || '\n',
      visibility: VISIBILITY.normalize(detail.visibility & defaultVisibility),
    });
    DOMEventNavigate('/compose');
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

  handleNavigate ({ detail: { destination } }) {
    const { history } = this.props;
    //  Once we have multi-column support, we will need to check if
    //  the column is already open before we try navigating there.
    //  Note that this may be especially difficult for columns with
    //  hashes (might just want to disallow those lol).
    history.push(destination);
  }

  handleSensitive (value) {
    const { sensitive } = this.state;
    this.setState({
      idempotency: uuid(),
      sensitive: typeof value === 'undefined' ? !sensitive : !!value,
    });
  }

  handleSpoiler (spoiler) {
    this.setState({
      idempotency: uuid(),
      spoiler: '' + spoiler,
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
        visibility,
      });
    }
  }

  handleText (text) {
    this.setState({
      idempotency: uuid(),
      text: '' + text,
    });
  }

  handleVisibility (value) {
    this.setState({
      idempotency: uuid(),
      visibility: VISIBILITY.normalize(value),
    });
  }

  //  TK: Drag and Drop API

  //  TK: Push notificaitons

  render () {
    const {
      handleMediaRemove,
      handleSensitive,
      handleSpoiler,
      handleSubmit,
      handleText,
      handleVisibility,
    } = this;
    const {
      className,
      location,
      ℳ,
    } = this.props;
    const {
      media,
      spoiler,
      text,
      visibility,
    } = this.state;

    const computedClass = classNames('MASTODON_GO--ROUTED--UI', className);

    const columns = { size: 0 };  //  for now

    return (
      <div className={computedClass}>
        <RoutedUIModal />
        <RoutedUIColumn
          activeRoute
          index={columns.size}
          location={location}
          media={media}
          onMediaRemove={handleMediaRemove}
          onSensitive={handleSensitive}
          onSpoiler={handleSpoiler}
          onSubmit={handleSubmit}
          onText={handleText}
          onVisibility={handleVisibility}
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
