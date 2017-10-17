import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

//  Common imports.
import { CommonPaneller } from 'themes/mastodon-go/components';

//  Component imports.
import ProfileContent from './content';
import ProfileMenu from './menu';
import ProfilePanel from './panel';

export default class Profile extends React.PureComponent {

  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    hash: PropTypes.string,
    history: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    '🛄': PropTypes.shape({ intl: PropTypes.object.isRequired }).isRequired,
    '💪': PropTypes.objectOf(PropTypes.func),
    '🏪': PropTypes.shape({
      bio: ImmutablePropTypes.map,
      counts: ImmutablePropTypes.map,
      header: ImmutablePropTypes.map,
      href: PropTypes.string,
      local: PropTypes.bool,
      me: PropTypes.string,
      rainbow: ImmutablePropTypes.map,
      relationship: PropTypes.number,
    }).isRequired,
  }
  state = { storedHash: '#' };

  //  Constructor.  We go ahead and fetch the profile right away.
  constructor (props) {
    super(props);
    const { '💪': { fetch } } = this.props;
    fetch();
  }

  //  If our component is suddenly no longer the active route, we need
  //  to store its hash value before it disappears.  If our id is about
  //  about to change, we need to fetch the new id.
  componentWillReceiveProps (nextProps) {
    const {
      activeRoute,
      hash,
      id,
      '💪': { fetch },
    } = this.props;
    if (activeRoute && !nextProps.activeRoute) {
      this.setState({ storedHash: hash });
    }
    if (id !== nextProps.id) {
      fetch(id);
    }
  }

  //  This is a tiny function to update our hash if needbe.
  handleSetHash = hash => {
    const { activeRoute } = this;
    if (!activeRoute) {
      this.setState({ storedHash: hash });
    }
  }

  //  Rendering.
  render () {
    const { handleSetHash } = this;
    const {
      activeRoute,
      className,
      hash,
      history,
      id,
      '🛄': { intl },
      '💪': handler,
      '🏪': {
        at,
        bio,
        counts,
        header,
        href,
        local,
        me,
        rainbow,
        relationship,
      },
      ...rest
    } = this.props;
    const { storedHash } = this.state;
    const computedClass = classNames('MASTODON_GO--PROFILE', className);

    //  We only use our internal hash if this isn't the active route.
    const computedHash = activeRoute ? hash : storedHash;

    //  Putting everything together.
    return (
      <CommonPaneller
        className={computedClass}
        menu={
          <ProfileMenu
            activeRoute={activeRoute}
            hash={computedHash}
            history={history}
            intl={intl}
            onSetHash={handleSetHash}
            title={'@' + at}
          />
        }
        panel={
          <ProfilePanel
            hash={computedHash}
            id={id}
          />
        }
        title={'@' + at}
        {...rest}
      >
        <ProfileContent
          activeRoute={activeRoute}
          bio={bio}
          counts={counts}
          handler={handler}
          header={header}
          history={history}
          href={href}
          id={id}
          local={local}
          me={me}
          onSetHash={handleSetHash}
          rainbow={rainbow}
          relationship={relationship}
        />
      </CommonPaneller>
    );
  }

}
