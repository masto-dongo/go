//  <ConnectedAvatar>
//  =================

//  `account` gives our main account, while `comrade` gives another
//  (eg, the account of a reblogger) which is displayed as an overlay.
//  Avatars are squares by default; `circular` gives a circular one if
//  your sensibilities roll that direction.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import { CommonImage } from 'themes/mastodon-go/components';

//  Request imports.
import { fetchAccount } from 'themes/mastodon-go/redux';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
class Avatar extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);
    const {
      comrade,
      '💪': { fetch },
    } = this.props;

    //  Fetching the account.  This only goes through if the account
    //  isn't already in our store.
    fetch();
    if (comrade) {
      fetch(comrade);
    }
  }

  //  If our `id` is about to change, we need to fetch the new account.
  componentWillReceiveProps (nextProps) {
    const {
      account,
      comrade,
      '💪': { fetch },
    } = this.props;
    if (account !== nextProps.account) {
      fetch(nextProps.account);
    }
    if (nextProps.comrade && comrade !== nextProps.comrade) {
      fetch(nextProps.comrade);
    }
  }

  //  Rendering.
  render () {
    const {
      className,
      circular,
      comrade,
      '🏪': {
        autoplay,
        accountAt,
        accountSrc,
        comradeAt,
        comradeSrc,
      },
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--AVATAR', {
      circular: circular,
    }, className);

    //  Avatars are a straightforward div with image(s) inside.
    return comrade && comradeSrc ? (
      <div className={computedClass}>
        <CommonImage
          autoplay={autoplay}
          animatedSrc={accountSrc ? accountSrc.get('original') : null}
          className='main'
          description={accountAt}
          staticSrc={accountSrc ? accountSrc.get('static') : null}
        />
        <CommonImage
          autoplay={autoplay}
          animatedSrc={comradeSrc.get('original')}
          className='comrade'
          description={comradeAt}
          staticSrc={comradeSrc.get('static')}
        />
      </div>
    ) : (
      <div className={computedClass}>
        <CommonImage
          autoplay={autoplay}
          animatedSrc={accountSrc ? accountSrc.get('original') : null}
          className='solo'
          description={accountAt}
          staticSrc={accountSrc ? accountSrc.get('static') : null}
        />
      </div>
    );
  }

}

//  Props.
Avatar.propTypes = {
  account: PropTypes.string.isRequired,  //  The id of the avatar's account
  circular: PropTypes.bool,  //  Whether to make a circular avatar
  className: PropTypes.string,
  comrade: PropTypes.string,  //  The id of an associated account
  ℳ: PropTypes.func,
  '🏪': PropTypes.shape({
    autoplay: PropTypes.bool,  //  Whether to autoplay GIF avatars
    accountAt: PropTypes.string,  //  The @ of the avatar's account
    accountSrc: ImmutablePropTypes.map,  //  The avatar's source
    comradeAt: PropTypes.string,  //  The @ of the associated account
    comradeSrc: ImmutablePropTypes.map,  //  The associated account's source
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component.
var ConnectedAvatar = connect(

  //  Component.
  Avatar,

  //  Store.
  createStructuredSelector({
    accountAt: (state, { account }) => state.getIn(['account', account, 'at']),
    accountSrc: (state, { account }) => state.getIn(['account', account, 'avatar']),
    autoplay: state => state.getIn(['meta', 'autoplay']),
    comradeAt: (state, { comrade }) => comrade ? state.getIn(['account', comrade, 'at']) : null,
    comradeSrc: (state, { comrade }) => comrade ? state.getIn(['account', comrade, 'avatar']) : null,
  }),

  //  Messages.
  null,

  //  Handlers.
  (go, store, { account }) => ({
    fetch: (id = account) => go(fetchAccount, id, false),
  })
);

//  Exporting.
export { ConnectedAvatar as default };
