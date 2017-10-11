import classNames from 'classnames'
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';

import { AccountContainer } from 'themes/mastodon-go/components';

import {
  CommonHeader,
  CommonList,
  CommonLoadbar,
} from 'themes/mastodon-go/components';

import CatalogueMenu from './menu';

import './style';

const messages = defineMessages({
  catalogue: {
    defaultMessage: "Catalogue",
    id: "catalogue.catalogue",
  }
})

export default class Catalogue extends React.PureComponent {

  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    hash: PropTypes.string,
    history: PropTypes.object,
    icon: PropTypes.string,
    path: PropTypes.string.isRequired,
    title: PropTypes.node,
    '🛄': PropTypes.shape({ intl: PropTypes.object.isRequired }).isRequired,
    '💪': PropTypes.objectOf(PropTypes.func).isRequired,
    '🏪': PropTypes.shape({
      accounts: ImmutablePropTypes.list,
      isLoading: PropTypes.bool,
      rainbow: ImmutablePropTypes.map,
    }).isRequired,
  };
  state = { storedHash: '#' };
  node = null;

  constructor (props) {
    super(props);
    const { '💪': { fetch } } = this.props;
    fetch();
  }

  handleLoadMore = () => {
    const { '💪': { expand } } = this.props;
    expand();
  }

  handleSetHash = (hash) => {
    this.setState({ storedHash: hash });
  }

  setRef = node => this.node = node;

  render () {
    const {
      handleSetDetail,
      handleSetHash,
      setRef,
    } = this;
    const {
      activeRoute,
      className,
      hash,
      history,
      icon,
      intl,
      path,
      title,
      '🛄': { intl },
      '💪': handler,
      '🏪': {
        accounts,
        isLoading,
        rainbow,
      },
      ...rest
    } = this.props;
    const { storedHash } = this.state;

    const computedClass = classNames('MASTODON_GO--CATALOGUE', className);
    const computedHash = activeRoute ? hash : storedHash;

    return (
      <div
        className={computedClass}
        ref={setRef}
        {...rest}
      >
        <CatalogueMenu
          activeRoute={activeRoute}
          hash={computedHash}
          history={history}
          icon={icon}
          intl={intl}
          onSetHash={handleSetHash}
          rainbow={rainbow}
          title={intl.formatMessage(messages.catalogue)}
        />
        <CommonHeader
          backgroundImage={`linear-gradient(160deg, ${rainbow.get('7').join(', ')})`}
          colour={rainbow.get('1')}
        >{title}</CommonHeader>
        <CommonList>
          {accounts ? accounts.reduce(
            (items, id) => items.push(
              <AccountContainer
                id={id}
                key={id}
              />
            ),
            []
          ) : null}
        </CommonList>
        {isLoading ? (
          <CommonLoadbar backgroundImage:={`linear-gradient(90deg, ${rainbow.get('15').join(', ')}, ${rainbow.getIn(['15', 0])})`} />
        ) : null}
      </div>
    );
  }

}
