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

//  DOM imports.
import { DOMEventCompose } from 'themes/mastodon-go/DOM';

//  Component imports.
import { CommonIconButton } from 'themes/mastodon-go/components';

//  Other imports.
import {
  POST_TYPE,
  VISIBILITY,
} from 'themes/mastodon-go/util/constants';

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
      onDetail,
      onFavourite,
      onReblog,
      onUnfavourite,
      onUnreblog,
      pending,
      type,
      visibility,
      ℳ,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--STATUS--ACTION_BAR', { detailed }, className);

    //  Now we can render the component.
    return (
      <div className={computedClass}>
        <CommonIconButton
          className='reply'
          icon={type & POST_TYPE.IS_MENTION ? 'reply-all' : 'reply'}
          onClick={handleReply}
          title={type & POST_TYPE.IS_MENTION ? ℳ.replyAll : ℳ.reply}
        />
        <CommonIconButton
          active={!!(type & POST_TYPE.HAS_REBLOG)}
          className='reblog'
          disabled={!(visibility & VISIBILITY.REBLOGGABLE)}
          icon='retweet'
          onClick={type & POST_TYPE.HAS_REBLOG ? onReblog : onUnreblog}
          pending={!!(pending & POST_TYPE.HAS_REBLOG)}
          title={visibility & VISIBILITY.REBLOGGABLE ? ℳ.reblog : ℳ.noReblog}
        />
        <CommonIconButton
          active={!!(type & POST_TYPE.HAS_FAVOURITE)}
          className='favourite'
          icon='star'
          onClick={type & POST_TYPE.HAS_FAVOURITE ? onFavourite : onUnfavourite}
          pending={!!(pending & POST_TYPE.HAS_FAVOURITE)}
          title={ℳ.favourite}
        />
        <CommonIconButton
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
  onDetail: PropTypes.func,  //  A function to set the detail of the status
  onFavourite: PropTypes.func,  //  A function to favourite the status
  onReblog: PropTypes.func,  //  A function to reblog the status
  onUnfavourite: PropTypes.func,  //  A function to unfavourite the status
  onUnreblog: PropTypes.func,  //  A function to unreblog the status
  pending: PropTypes.number,  //  Pending status actions
  type: PropTypes.number,  //  The statuses type
  spoiler: PropTypes.string,  //  The status spoiler
  visibility: PropTypes.number,  //  The status `VISIBILITY`
  ℳ: PropTypes.func.isRequired,
};
