//  <StatusActionBar>
//  =================

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
import { defineMessages } from 'react-intl';

//  Our imports.
import CommonButton from 'themes/mastodon-go/components';

//  Other imports.
import { VISIBILITY } from 'themes/mastodon-go/util/constants';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  cannot_reblog:
    { id: 'status.cannot_reblog', defaultMessage: 'This post cannot be boosted' },
  expand:
    { id: 'status.expand', defaultMessage: 'Expand' },
  favourite:
    { id: 'status.favourite', defaultMessage: 'Favourite' },
  reblog:
    { id: 'status.reblog', defaultMessage: 'Boost' },
  reply:
    { id: 'status.reply', defaultMessage: 'Reply' },
  replyAll:
    { id: 'status.replyAll', defaultMessage: 'Reply to thread' },
});

//  * * * * * * *  //

//  The component
//  -------------

export default class StatusActionBar extends React.PureComponent {

  //  Props.
  static propTypes = {
    className: PropTypes.string,
    detailed: PropTypes.bool,
    handler: PropTypes.objectOf(PropTypes.func).isRequired,
    history: PropTypes.object,
    intl: PropTypes.object.isRequired,
    is: ImmutablePropTypes.map.isRequired,
    me: PropTypes.number,
    setDetail: PropTypes.func,
    visibility: PropTypes.number,
  };

  //  These handle all of our actions.
  handleReplyClick = () => {
    const { handler, history, status } = this.props;
    handler.reply(status, { history });  //  hack
  }
  handleMentionClick = () => {
    const { handler, history, status } = this.props;
    handler.mention(status.get('account'), { history });  //  hack
  }

  //  Renders our component.
  render () {
    const { handleReplyClick } = this;
    const {
      className,
      detailed,
      handler,
      history,
      intl,
      is,
      me,
      setDetail,
      visibility,
      ...rest
    } = this.props;

    const computedClass = classNames('MASTODON_GO--STATUS--ACTION_BAR', className);
    const account = status.get('account');
    const rebloggable = VISIBILITY & VISIBILITY.BOOSTABLE;
    const reblogTitle = rebloggable ? intl.formatMessage(messages.reblog) : intl.formatMessage(messages.cannot_reblog);
    const anonymousAccess = !me;
    let replyIcon;
    let replyTitle;

    //  This selects our reply icon.
    if (status.get('in_reply_to_id', null) === null) {
      replyIcon = 'reply';
      replyTitle = intl.formatMessage(messages.reply);
    } else {
      replyIcon = 'reply-all';
      replyTitle = intl.formatMessage(messages.replyAll);
    }

    //  Now we can render the component.
    return (
      <div className={computedClass}>
        <CommonButton
          disabled={anonymousAccess}
          title={replyTitle}
          icon={replyIcon}
          onClick={handleReplyClick}
        />
        <CommonButton
          disabled={anonymousAccess || reblogDisabled}
          active={is.get('reblogged')}
          title={reblogTitle}
          icon='retweet'
          onClick={handler.reblog}
        />
        <CommonButton
          disabled={anonymousAccess}
          animate
          active={is.get('favourited')}
          title={intl.formatMessage(messages.favourite)}
          icon='star'
          onClick={handler.favourite}
        />
        {
          setDetail ? (
            <CommonButton
              active={detailed}
              title={intl.formatMessage(messages.expand)}
              icon={detailed ? 'minus' : 'plus'}
              onClick={setDetail}
            />
          ) : null
        }
      </div>
    );
  }

}
