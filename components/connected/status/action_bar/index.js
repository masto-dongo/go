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

//  Component imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  Other imports.
import { VISIBILITY } from 'themes/mastodon-go/util/constants';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

export default class ConnectedStatusActionBar extends React.PureComponent {

  //  Props.
  static propTypes = {
    className: PropTypes.string,
    detailed: PropTypes.bool,
    handler: PropTypes.objectOf(PropTypes.func).isRequired,
    history: PropTypes.object,
    is: ImmutablePropTypes.map.isRequired,
    me: PropTypes.number,
    setDetail: PropTypes.func,
    visibility: PropTypes.number,
    ℳ: PropTypes.func.isRequired,
  };

  //  These handle all of our actions.
  handleReplyClick = () => {
  };
  handleMentionClick = () => {
  };

  //  Renders our component.
  render () {
    const { handleReplyClick } = this;
    const {
      className,
      detailed,
      handler,
      history,
      is,
      me,
      setDetail,
      visibility,
      ℳ,
      ...rest
    } = this.props;

    const computedClass = classNames('MASTODON_GO--CONNECTED--STATUS--ACTION_BAR', className);
    const rebloggable = VISIBILITY & VISIBILITY.BOOSTABLE;
    const reblogTitle = rebloggable ? ℳ.reblog : ℳ.noReblog;
    const anonymousAccess = !me;
    let replyIcon;
    let replyTitle;

    //  This selects our reply icon.
    if (is.get('reply')) {
      replyIcon = 'reply';
      replyTitle = ℳ.reply;
    } else {
      replyIcon = 'reply-all';
      replyTitle = ℳ.replyAll;
    }

    //  Now we can render the component.
    return (
      <div
        className={computedClass}
        {...rest}
      >
        <CommonButton
          disabled={anonymousAccess}
          title={replyTitle}
          icon={replyIcon}
          onClick={handleReplyClick}
        />
        <CommonButton
          disabled={anonymousAccess || !rebloggable}
          active={is.get('reblogged')}
          title={reblogTitle}
          icon='retweet'
          onClick={handler.reblog}
        />
        <CommonButton
          disabled={anonymousAccess}
          animate
          active={is.get('favourited')}
          title={ℳ.favourite}
          icon='star'
          onClick={handler.favourite}
        />
        {
          setDetail ? (
            <CommonButton
              active={detailed}
              title={ℳ.expand}
              icon={detailed ? 'minus' : 'plus'}
              onClick={setDetail}
            />
          ) : null
        }
      </div>
    );
  }

}
