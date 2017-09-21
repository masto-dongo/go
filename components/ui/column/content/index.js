import classNames from 'classnames';
import PropTypes from 'prop-types';

import UIColumnContentUnknown from './unknown';
import CatalogueContainer from 'glitch/components/catalogue/container';
import ComposerContainer from 'glitch/components/composer/container';
import ConversationContainer from 'glitch/components/conversation/container';
import ProfileContainer from 'glitch/components/profile/container';
import StartContainer from 'glitch/components/start/container';
import TimelineContainer from 'glitch/components/timeline/container';

const UIColumnContent = ({
  className,
  meta = {},
  type,
  ...others
}) => {
  const computedClass = classNames('glitch', 'glitch__ui__column__content', className);
  <div className={computedClass} {...others}>
    {(() => {
      switch (type) {
      case 'account':
        return <ProfileContainer {...meta} />;

      case 'catalogue':
        switch (meta.name) {
        default:
          return <Catalogue path={`/api/v1${getParams()}`} />;
        }

      case 'compose':
        return <ComposeContainer {...meta} />

      case 'conversation':
        return <ConversationContainer {...meta} />;

      case 'start':
        return <StartContainer {...meta} />;

      case 'timeline':
        const params = [];
        const getParams = () => params.length ? '?' + params.join('&') : '';
        switch (meta.name) {
        case 'favourites':
          return (
            <TimelineContainer
              path={`/api/v1/favourites${getParams()}`}
            />
          );
        case 'hashtag':
          if (meta.onlyLocal) params.push('local=true');
          return (
            <TimelineContainer
              path={`/api/v1/tag/${meta.query || '.'}${getParams()}`}
            />
          );
        case 'home':
          return (
            <TimelineContainer
              path={`/api/v1/home${getParams()}`}
            />
          );
        case 'notifications':
          return (
            <TimelineContainer
              path={`/api/v1/notifications${getParams()}`}
            />
          );
        case 'public':
          let params = [];
          if (meta.onlyLocal) params.push('local=true');
          return (
            <TimelineContainer
              path={`/api/v1/public${getParams()}`}
            />
          );
        default:
          return <TimelineContainer path={`/api/v1${getParams()}`} />;
        }

      default:
        return <UIColumnContentUnknown {...meta} />;
      }
    })()}
  </div>
};

UIColumnContent.propTypes = {
  className: PropTypes.string,
  meta: PropTypes.object,
  type: PropTypes.string.isRequired,
}

export default UIColumnContent;
