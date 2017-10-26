//  Package imports
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Component imports
import { ConnectedAccount } from 'themes/mastodon-go/components';
import ConnectedPreviewControls from './controls';
import ConnectedPreviewStatus from './status';
import ConnectedPreviewToggles from './toggles';

//  Stylesheet imports
import './style.scss';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

class Preview extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);
    const { spoiler } = this.props;

    //  State.
    this.state = { contentVisible: !spoiler };

    //  Binding functions.
    const { setExpansion } = Object.getPrototypeOf(this);
    this.setExpansion = setExpansion.bind(this);
  }

  //  `setExpansion` handles expanding and collapsing spoilers.
  setExpansion (value) {
    const { contentVisible } = this.state;
    switch (true) {

    //  A value of `null` or `undefined` flips the state.
    case value === undefined || value === null:
      this.setState({ contentVisible: !contentVisible });
      break;

    //  A value of `false` means that the status should be collapsed.
    case !value:
      this.setState({ contentVisible: false });
      break;

    //  A value of `true` means that the status should be expanded.
    case !!value:
      this.setState({ contentVisible: true });
      break;
    }
  }

  render () {
    const { setExpansion } = this;
    const {
      className,
      inReplyTo,
      media,
      onSensitive,
      onSubmit,
      onVisibility,
      sensitive,
      spoiler,
      text,
      visibility,
      ℳ,
      '🏪': { me },
    } = this.props;
    const { contentVisible } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--PREVIEW', className);

    return (
      <div className={computedClass}>
        <div className='status'>
          <ConnectedAccount
            history={history}
            id={me}
            small
          />
          <ConnectedPreviewStatus
            content={text}
            contentVisible={contentVisible}
            media={media}
            sensitive={sensitive}
            setExpansion={setExpansion}
            spoiler={spoiler}
            ℳ={ℳ}
          />
        </div>
        <ConnectedPreviewToggles
          onSensitive={onSensitive}
          onVisibility={onVisibility}
          sensitive={sensitive}
          visibility={visibility}
          ℳ={ℳ}
        />
        <ConnectedPreviewControls
          onSubmit={onSubmit}
          ℳ={ℳ}
        />
      </div>
    );
  }

}

Preview.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  inReplyTo: PropTypes.string,
  media: PropTypes.array,
  onClear: PropTypes.func,
  onMediaRemove: PropTypes.func,
  onSensitive: PropTypes.func,
  onSpoiler: PropTypes.func,
  onSubmit: PropTypes.func,
  onText: PropTypes.func,
  onUpload: PropTypes.func,
  onVisibility: PropTypes.func,
  rehash: PropTypes.func,
  sensitive: PropTypes.bool,
  spoiler: PropTypes.string,
  text: PropTypes.string.isRequired,
  visibility: PropTypes.number,
  ℳ: PropTypes.func.isRequired,
  '🏪': PropTypes.shape({ me: PropTypes.string }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func),
};

var ConnectedPreview = connect(

  //  Component.
  Preview,

  //  Store.
  createStructuredSelector({
    me: store => store.getIn(['meta', 'me']),
  }),

  //  Messages.
  defineMessages({
    directOff: {
      defaultMessage: 'Non-direct',
      description: 'Used to disable direct messaging',
      id: 'composer.direct_off',
    },
    directOn: {
      defaultMessage: 'Direct',
      description: 'Used to enable direct messaging',
      id: 'composer.direct_on',
    },
    federatedOff: {
      defaultMessage: 'Local-only',
      description: 'Used to disable federation',
      id: 'composer.federated_off',
    },
    federatedOn: {
      defaultMessage: 'Federated',
      description: 'Used to enable federation',
      id: 'composer.federated_on',
    },
    listedOff: {
      defaultMessage: 'Unlisted',
      description: 'Used to disable listing',
      id: 'composer.listed_off',
    },
    listedOn: {
      defaultMessage: 'Public',
      description: 'Used to enable listing',
      id: 'composer.listed_on',
    },
    rebloggableOff: {
      defaultMessage: 'Private',
      description: 'Used to disable reblogging',
      id: 'composer.rebloggable_off',
    },
    rebloggableOn: {
      defaultMessage: 'Boostable',
      description: 'Used to enable reblogging',
      id: 'composer.rebloggable_on',
    },
    publish: {
      defaultMessage: 'Toot',
      description: 'Used to label the toot button',
      id: 'composer.publish',
    },
    showMore: {
      defaultMessage: 'Show more',
      description: 'Used as the label for the "Show more" button',
      id: 'status.show_more',
    },
    showLess: {
      defaultMessage: 'Show less',
      description: 'Used as the label for the "Show less" button',
      id: 'status.show_less',
    },
  })

);

export { ConnectedPreview as default };
