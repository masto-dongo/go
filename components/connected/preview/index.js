//  <ConnectedPreview>
//  ==================

//  This component creates the preview panel for the composer. It
//  generates a faux-status preview and has toggles for visibility
//  and the like.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
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
import { VISIBILITY } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
class Preview extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);
    const { spoiler } = this.props;

    //  State.
    this.state = { contentVisible: !spoiler };

    //  Binding functions.
    const { handleExpansion } = Object.getPrototypeOf(this);
    this.handleExpansion = handleExpansion.bind(this);
  }

  //  `handleExpansion` handles expanding and collapsing spoilers.
  handleExpansion (value) {
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

  //  Rendering.
  render () {
    const { handleExpansion } = this;
    const {
      className,
      disabled,
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
      '🏪': {
        customEmoji,
        me,
      },
    } = this.props;
    const { contentVisible } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--PREVIEW', { disabled }, className);

    //  We just render our components in order.
    return (
      <div className={computedClass}>
        <div className='status'>
          <ConnectedAccount
            id={me}
            navigable
            small
          />
          <ConnectedPreviewStatus
            content={text}
            contentVisible={contentVisible}
            emoji={customEmoji}
            media={media}
            onExpansion={handleExpansion}
            sensitive={sensitive}
            spoiler={spoiler}
            ℳ={ℳ}
          />
        </div>
        <ConnectedPreviewToggles
          disabled={disabled}
          onSensitive={onSensitive}
          onVisibility={onVisibility}
          sensitive={sensitive}
          visibility={visibility}
          ℳ={ℳ}
        />
        <ConnectedPreviewControls
          disabled={disabled}
          local={!(visibility & VISIBILITY.FEDERATED)}
          onSubmit={onSubmit}
          spoiler={spoiler}
          text={text}
          ℳ={ℳ}
        />
      </div>
    );
  }

}

//  Props.
Preview.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,  //  `true` if the composer is currently disabled
  inReplyTo: PropTypes.string,  //  The id of the status this post is in reply to
  media: PropTypes.array,  //  An array of media attachments
  onSensitive: PropTypes.func,  //  A function to call when toggling status sensitivity
  onSubmit: PropTypes.func,  //  A function to call to submit the status
  onVisibility: PropTypes.func,  //  A function to call to change the status visibility
  sensitive: PropTypes.bool,  //  `true` if the status has sensitive media
  spoiler: PropTypes.string,  //  The status spoiler
  text: PropTypes.string.isRequired,  //  The text of the status
  visibility: PropTypes.number,  //  The status `VISIBILITY`
  ℳ: PropTypes.func.isRequired,
  '🏪': PropTypes.shape({
    customEmoji: ImmutablePropTypes.list,  //  A list of custom emoji
    me: PropTypes.string,  //  The current user's id
  }).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component.
var ConnectedPreview = connect(

  //  Component.
  Preview,

  //  Store.
  createStructuredSelector({
    customEmoji: store => store.getIn(['emoji', 'custom']),
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

//  Exporting.
export { ConnectedPreview as default };
