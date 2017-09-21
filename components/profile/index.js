import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';

import ProfileActionBar from './action_bar';
import ProfileContent from './content';
import ProfileHeader from './header';
import ProfileMissing from './missing';

export default class Profile extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    className: PropTypes.string,
    handler: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    me: PropTypes.number.isRequired,
    mode: PropTypes.string.isRequired,
    noReplies: PropTypes.bool,
    onlyMedia: PropTypes.bool,
    onlyPinned: PropTypes.bool,
  }

  handleFollow = () => {
    { account, handler } = this.props;
    handler.follow(account);
  }

  render () {
    const {
      handleFollow,
    } = this;
    const {
      account,
      className,
      handler,
      history,
      id,
      me,
      mode,
      onlyMedia,
      ...others
    } = this.props;

    const computedClass = classNames('glitch', 'glitch__profile', className);

    if (!account) return (
      <ProfileMissing className='profile\missing' />
    );

    //  Returns `true` for local users.
    const local = account.get('acct') !== account.get('username');

    return (
      <article className={computedClass} {...others}>
        <ProfileHeader
          account={account}
          className='profile\header'
          history={history}
          me={me}
          onFollow={handleFollow}
        />
        <ProfileContent
          className='profile\metadata'
          local={!domain}
          href={account.get('url')}
          note={account.get('note')}
        />
        <ProfileActionBar
          account={account}
          className='profile\actions'
          handler={handler}
          history={history}
          intl={intl}
          me={me}
        />
        {(() => {
          switch (mode) {
            case 'followers':
            case 'following':
          case 'timeline':
            const params = [];
            const getParams = () => params.length ? '?' + params.join('&') : '';
            if (noReplies) params.push('exclude_replies=true');
            if (onlyMedia) params.push('only_media=true');
            if (onlyPinned) params.push('pinned=true');
            return (
              <TimelineContainer
                path={`/api/v1/accounts/${id}/statuses${getParams()}`}
              />
            );
          }
        })()}
      </article>
    );
  }

}
