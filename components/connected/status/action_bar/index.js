//  <ConnectedStatusActionBar>
//  ==========================

//  This component renders the action bar for statuses—those buttons
//  at the bottom which let you favourite and reply and such.

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

//  Component definition.
export default class ConnectedStatusActionBar extends React.PureComponent {

  //  Constructor.
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
      text: '@' + at + ' ',
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
      onUnfavourite,
      onUnreblog,
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
      replyIcon = 'reply-all';
      replyTitle = ℳ.replyAll;
    } else {
      replyIcon = 'reply';
      replyTitle = ℳ.reply;
    }

    //  Now we can render the component.
    return (
      <div className={computedClass}>
        <CommonButton
          className='reply'
          icon={replyIcon}
          onClick={handleReply}
          title={replyTitle}
        />
        <CommonButton
          active={is.get('reblogged')}
          className='reblog'
          disabled={!rebloggable}
          icon='retweet'
          onClick={!is.get('reblogged') ? onReblog : onUnreblog}
          title={reblogTitle}
        />
        <CommonButton
          active={is.get('favourited')}
          animate
          className='favourite'
          icon='star'
          onClick={!is.get('favourited') ? onFavourite : onUnfavourite}
          title={ℳ.favourite}
        />
        <CommonButton
          active={detailed}
          className='detail'
          icon={detailed ? 'minus' : 'plus'}
          onClick={onDetail}
          title={ℳ.expand}
        />
      </div>
    );
  }

}

//  Props.
ConnectedStatusActionBar.propTypes = {
  at: PropTypes.string,  //  The @ of the status's author
  className: PropTypes.string,
  detailed: PropTypes.bool,  //  `true` if the status is detailed
  id: PropTypes.string,  //  The id of the status
  is: ImmutablePropTypes.map.isRequired,  //  What the status is
  onDetail: PropTypes.func,  //  A function to set the detail of the status
  onFavourite: PropTypes.func,  //  A function to favourite the status
  onReblog: PropTypes.func,  //  A function to reblog the status
  onUnfavourite: PropTypes.func,  //  A function to unfavourite the status
  onUnreblog: PropTypes.func,  //  A function to unreblog the status
  spoiler: PropTypes.string,  //  The status spoiler
  visibility: PropTypes.number,  //  The status `VISIBILITY`
  ℳ: PropTypes.func.isRequired,
};
