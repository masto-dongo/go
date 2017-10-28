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

//  DOM imports.
import { DOMEventCompose } from 'themes/mastodon-go/DOM';

//  Component imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  Other imports.
import { VISIBILITY } from 'themes/mastodon-go/util/constants';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

export default class ConnectedStatusActionBar extends React.PureComponent {

  constructor (props) {
    super(props);
    const {
      at,
      id,
      spoiler,
      visibility,
    } = this.props;

    //  Function binding.
    this.handleReply = DOMEventCompose.bind(this, {
      inReplyTo: id,
      spoiler,
      text: '@' + at,
      visibility,
    });
  }

  //  Renders our component.
  render () {
    const { handleReply } = this;
    const {
      className,
      detailed,
      is,
      onDetail,
      onFavourite,
      onReblog,
      visibility,
      ℳ,
    } = this.props;

    const computedClass = classNames('MASTODON_GO--CONNECTED--STATUS--ACTION_BAR', { detailed }, className);
    const rebloggable = visibility & VISIBILITY.REBLOGGABLE;
    const reblogTitle = rebloggable ? ℳ.reblog : ℳ.noReblog;
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
      <div className={computedClass}>
        <CommonButton
          title={replyTitle}
          icon={replyIcon}
          onClick={handleReply}
        />
        <CommonButton
          active={is.get('reblogged')}
          disabled={!rebloggable}
          icon='retweet'
          onClick={onReblog}
          title={reblogTitle}
        />
        <CommonButton
          active={is.get('favourited')}
          animate
          icon='star'
          onClick={onFavourite}
          title={ℳ.favourite}
        />
        {
          onDetail ? (
            <CommonButton
              active={detailed}
              title={ℳ.expand}
              icon={detailed ? 'minus' : 'plus'}
              onClick={onDetail}
            />
          ) : null
        }
      </div>
    );
  }

}

ConnectedStatusActionBar.propTypes = {
  at: PropTypes.string,
  className: PropTypes.string,
  detailed: PropTypes.bool,
  id: PropTypes.string,
  is: ImmutablePropTypes.map.isRequired,
  onDetail: PropTypes.func,
  onFavourite: PropTypes.func,
  onReblog: PropTypes.func,
  spoiler: PropTypes.string,
  visibility: PropTypes.number,
  ℳ: PropTypes.func.isRequired,
};
