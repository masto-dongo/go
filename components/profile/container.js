import { debounce } from 'lodash';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { createSelector } from 'reselect';

import {
  followAccount,
  unfollowAccount,
  blockAccount,
  unblockAccount,
  muteAccount,
  unmuteAccount,
} from 'mastodon/actions/accounts';
import { mentionCompose } from 'mastodon/actions/compose';
import { initReport } from 'mastodon/actions/reports';
import { openModal } from 'mastodon/actions/modal';
import { blockDomain, unblockDomain } from 'mastodon/actions/domain_blocks';
import makeGetAccount from 'mastodon/selectors';

import Profile from '.';

const messages = defineMessages({
  blockConfirm:
    { id: 'confirmations.block.confirm', defaultMessage: 'Block' },
  blockMessage:
    { id:'confirmations.block.message', defaultMessage:'Are you sure you want to block {name}?' },
  blockDomainConfirm:
    { id: 'confirmations.domain_block.confirm', defaultMessage: 'Hide entire domain' },
  blockDomainMessage:
    { id: 'confirmations.domain_block.message', defaultMessage: 'Are you really, really sure you want to block the entire {domain}? In most cases a few targeted blocks or mutes are sufficient and preferable.' },
  muteConfirm:
    { id: 'confirmations.mute.confirm', defaultMessage: 'Mute' },
  muteMessage:
    { id: 'confirmations.mute.message', defaultMessage: 'Are you sure you want to mute {name}?' },
  unfollowConfirm:
    { id: 'confirmations.unfollow.confirm', defaultMessage: 'Unfollow' },
  unfollowMessage:
    { id: 'confirmations.unfollow.message', defaultMessage: 'Are you sure you want to unfollow {name}?' },
});

const makeMapStateToProps = () => {
  const accountSelector = makeGetAccount();

  return (state, ownProps) => ({
    account: accountSelector(state, ownProps.id),
    me: state.getIn(['meta', 'me']),
    unfollowModal: state.getIn(['meta', 'unfollow_modal']),
  });
}

const makeMapDispatchToProps = (dispatch) => createSelector(
  [
    (_, { intl }) => intl,
  ],

  (intl) => ({
    handler : {
      block (account) {
        if (account.getIn(['relationship', 'blocking'])) {
          dispatch(unblockAccount(account.get('id')));
        } else dispatch(openModal('CONFIRM', {
          message: (
            <FormattedMessage
              {...messages.blockMessage}
              values={{ name: <strong>@{account.get('acct')}</strong> }}
            />
          ),
          confirm: intl.formatMessage(messages.blockConfirm),
          onConfirm: () => dispatch(blockAccount(account.get('id'))),
        }));
      },
      blockDomain (domain, accountId) {
        if (account.getIn(['relationship', 'domain_blocking'])) {
          dispatch(unblockDomain(domain, accountId));
        } else dispatch(openModal('CONFIRM', {
          message: (
            <FormattedMessage
              {...messages.blockDomainMessage}
              values={{ domain: <strong>{domain}</strong> }}
            />
          ),
          confirm: intl.formatMessage(messages.blockDomainConfirm),
          onConfirm: () => dispatch(blockDomain(domain, accountId)),
        }));
      },
      follow (account) {
        if (account.getIn(['relationship', 'following'])) {
          if (this.unfollowModal) dispatch(openModal('CONFIRM', {  //  TODO: THIS IS BORKN (this refers to handler)
            message: (
              <FormattedMessage
                {...messages.unfollowMessage}
                values={{ name: <strong>@{account.get('acct')}</strong> }}
              />
            ),
            confirm: intl.formatMessage(messages.unfollowConfirm),
            onConfirm: () => dispatch(unfollowAccount(account.get('id'))),
          }));
          else dispatch(unfollowAccount(account.get('id')));
        } else dispatch(followAccount(account.get('id')));
      },
      mention (account, router) {
        dispatch(mentionCompose(account, router));
      },
      mute (account) {
        if (account.getIn(['relationship', 'muting'])) {
          dispatch(unmuteAccount(account.get('id')));
        } else dispatch(openModal('CONFIRM', {
          message: (
            <FormattedMessage
              {...messages.muteMessage}
              values={{ name: <strong>@{account.get('acct')}</strong> }}
            />
          ),
          confirm: intl.formatMessage(messages.muteConfirm),
          onConfirm: () => dispatch(muteAccount(account.get('id'))),
        }));
      },
      report (account) {
        dispatch(initReport(account));
      },
    },
  }),
);

export default injectIntl(
  connect(makeMapStateToProps, makeMapDispatchToProps)(
    withRouter(Profile)
  )
);
