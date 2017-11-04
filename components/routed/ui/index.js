//  <RoutedUI>
//  ==========

//  This component holds the state for our composer, so that you can
//  navigate to and from the composer column without losing your work.
//  All of the actual routing takes place in `<RoutedUIColumn>`.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
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
  DOMEventUpload,
  DOMForget,
  DOMListen,
} from 'themes/mastodon-go/DOM';

//  Component imports.
import RoutedUIColumn from './column';
import RoutedUIModal from './modal';

//  Request imports.
import {
  loadMeta,
  submitAttachment,
  submitStatus,
} from 'themes/mastodon-go/redux';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';
import { VISIBILITY } from 'themes/mastodon-go/util/constants';
import uuid from 'themes/mastodon-go/util/uuid';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
class UI extends React.Component {  //  Impure

  //  Constructor.
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
      uploading: false,
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
      handleUpload,
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
    this.handleUpload = handleUpload.bind(this);
    this.handleVisibility = handleVisibility.bind(this);

    //  Fetching.
    fetch();
  }

  //  If our default visibility changes and our composer is empty, we
  //  need to reset its visibility to the default.
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

  //  When mounting, we listen for composer-related events. On
  //  unmounting, we stop listening.
  componentWillMount () {
    const {
      handleAttach,
      handleCompose,
      handleNavigate,
      handleUpload,
    } = this;
    DOMListen(DOMEventAttach, handleAttach);
    DOMListen(DOMEventCompose, handleCompose);
    DOMListen(DOMEventNavigate, handleNavigate);
    DOMListen(DOMEventUpload, handleUpload);
  }
  componentWillUnmount () {
    const {
      handleAttach,
      handleCompose,
      handleNavigate,
      handleUpload,
    } = this;
    DOMForget(DOMEventAttach, handleAttach);
    DOMForget(DOMEventCompose, handleCompose);
    DOMForget(DOMEventNavigate, handleNavigate);
    DOMForget(DOMEventUpload, handleUpload);
  }

  //  On attach we simply add the attachment to our `media` array.
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

  //  This function clears the composer and replaces it with the given
  //  contents, navigating to bring it into view.
  handleCompose ({ detail: {
    inReplyTo,
    spoiler,
    text,
    visibility,
  } }) {
    const { '🏪' : { defaultVisibility } } = this.props;
    this.setState({
      idempotency: uuid(),
      inReplyTo: inReplyTo ? '' + inReplyTo : null,
      media: [],
      sensitive: false,
      spoiler: spoiler ? '' + spoiler : '',
      text: text ? '' + text + '\n' : '\n',
      visibility: visibility === +visibility ? VISIBILITY.normalize(visibility & defaultVisibility) : defaultVisibility,
    });
    DOMEventNavigate('/compose');
  }

  //  This simple function just filters our `media` to remove an `id`.
  handleMediaRemove (id) {
    const { media } = this.state;
    this.setState({
      idempotency: uuid(),
      media: media.filter(
        mediaId => mediaId !== id
      ),
    });
  }

  //  This function ensures that a column is in view.
  handleNavigate ({ detail: { destination } }) {
    const { history } = this.props;
    //  Once we have multi-column support, we will need to check if
    //  the column is already open before we try navigating there.
    //  Note that this may be especially difficult for columns with
    //  hashes (might just want to disallow those lol).
    history.push(destination);
  }

  //  This function sets the sensitivity of the media attachments.
  handleSensitive (value) {
    const { sensitive } = this.state;
    this.setState({
      idempotency: uuid(),
      sensitive: typeof value === 'undefined' ? !sensitive : !!value,
    });
  }

  //  This function updates the status spoiler.
  handleSpoiler (spoiler) {
    this.setState({
      idempotency: uuid(),
      spoiler: '' + spoiler,
    });
  }

  //  This function submits the status.
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

  //  This function updates the status text.
  handleText (text) {
    this.setState({
      idempotency: uuid(),
      text: '' + text,
    });
  }

  //  This function handles an active upload.
  handleUpload ({ detail: { completed } }) {
    const { uploading } = this.state;
    if (completed === uploading) {
      this.setState({ uploading: !completed });
    }
  }

  //  This function updates the visibility of the status being
  //  composed.
  handleVisibility (value) {
    this.setState({
      idempotency: uuid(),
      visibility: VISIBILITY.normalize(value),
    });
  }

  //  TK: Drag and Drop API

  //  TK: Push notificaitons

  //  Rendering.
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
      '💪': { upload },
    } = this.props;
    const {
      media,
      sensitive,
      spoiler,
      text,
      uploading,
      visibility,
    } = this.state;
    const computedClass = classNames('MASTODON_GO--ROUTED--UI', className);

    //  TK: Actual column tracking (in the state).
    const columns = { size: 0 };  //  for now

    //  We just pass everything to the `<RoutedUIColumn>` for now.
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
          onUpload={upload}
          onVisibility={handleVisibility}
          sensitive={sensitive}
          spoiler={spoiler}
          text={text}
          uploading={uploading}
          visibility={visibility}
          ℳ={ℳ}
        />
      </div>
    );
  }

}

//  Props.
UI.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  staticContext: PropTypes.object,  //  Unused
  ℳ: PropTypes.func.isRequired,
  '🏪': PropTypes.shape({ defaultVisibility: PropTypes.number }).isRequired,  //  The default visibility for statuses
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component.
var RoutedUI = connect(

  //  Component.
  UI,

  //  Store.
  createStructuredSelector({
    defaultVisibility: state => state.getIn(['meta', 'visibility']),
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
    statusFavourites: {
      defaultMessage: 'Status favouriters',
      description: 'Used as the title for status favourites timelines',
      id: 'timeline.status_favourites',
    },
    statusReblogs: {
      defaultMessage: 'Status boosters',
      description: 'Used as the title for status reblogs timelines',
      id: 'timeline.status_reblogs',
    },
  }),

  //  Handlers.
  go => ({
    fetch: () => go(loadMeta),
    upload: file => go(submitAttachment, file),
    submit: (text, options) => go(submitStatus, text, options),
  })
);

//  Exporting.
export { RoutedUI as default };
