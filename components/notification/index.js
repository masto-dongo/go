//  Package imports  //
import classNames from 'class-names';
import PropTypes from 'prop-types';
import React from 'react';

//  Our imports  //
import {
  AccountContainer,
  StatusContainer,
} from 'themes/mastodon-go/components';

import { POST_TYPE } from 'themes/mastodon-go/util/constants';

export default class Notification extends React.PureComponent {

  static propTypes = {
    className: PropTypes.string,
    hideIf: PropTypes.number,
    id: PropTypes.string.isRequired,
    observer: PropTypes.object,
    '🛄': PropTypes.shape({ intl: PropTypes.object }),
    '💪': PropTypes.objectOf(PropTypes.func),
    '🏪': PropTypes.shape({
      account: PropTypes.string.isRequired,
      datetime: PropTypes.instanceOf(Date),
      status: PropTypes.string,
      type: PropTypes.number.isRequired,
    }).isRequired,
  };

  render () {
    const {
      className,
      hideIf,
      id,
      observer,
      '🛄': context,
      '💪': handler,
      '🏪': {
        account,
        status,
        type,
      },
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--NOTIFICATION', className);

    if (hideIf & type) {
      return null;
    }

    if (type & POST_TYPE.STATUS) {
      return (
        <StatusContainer
          className={computedClass}
          comrade={account}
          containerId={id}
          id={status}
          observer={observer}
          type={type}
          {...rest}
        />
      );
    }

    return (
      <AccountContainer
        className={computedClass}
        containerId={id}
        id={account}
        observer={observer}
        type={type}
        {...rest}
      />
    );
  }

}
