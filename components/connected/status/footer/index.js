//  <ConnectedStatusFooter>
//  =======================

//  This component renders footer information for the status, like
//  when it was posted, and its visibility.  It is more detailed on
//  detailed statuses.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedDate } from 'react-intl';

//  Component imports.
import {
  CommonIcon,
  CommonLink,
  CommonSeparator,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import { VISIBILITY } from 'themes/mastodon-go/util/constants';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ConnectedStatusFooter ({
  application,
  className,
  datetime,
  detailed,
  href,
  visibility,
  ℳ,
}) {
  const computedClass = classNames('MASTODON_GO--CONNECTED--STATUS--FOOTER', { detailed }, className);

  //  Here we select our visibility icon and text based on our provided
  //  `visibility`.  We don't care about whether our status is local or
  //  not.
  let visibilityIcon;
  let visibilityText;
  switch (visibility.normalize(visibility | VISIBILITY.FEDERATED)) {
  case VISIBILITY.PUBLIC:
    visibilityIcon = 'globe';
    visibilityText = ℳ.public;
    break;
  case VISIBILITY.UNLISTED:
    visibilityIcon = 'unlock-alt';
    visibilityText = ℳ.unlisted;
    break;
  case VISIBILITY.PRIVATE:
    visibilityIcon = 'lock';
    visibilityText = ℳ.private;
    break;
  case VISIBILITY.DIRECT:
    visibilityIcon = 'envelope';
    visibilityText = ℳ.direct;
    break;
  default:
    visibilityIcon = 'question-circle';
    visibilityText = ℳ.unknown;
    break;
  }

  //  If our status isn't detailed, our footer only contains the
  //  relative timestamp and visibility information.
  if (!detailed) return (
    <footer className={computedClass}>
      <CommonIcon
        name={visibilityIcon}
        proportional
        title={visibilityText}
      />
      {' '}
      {
        //  TK: Status timestamps
        <CommonLink
          className='timestamp'
          href={href}
          title={ℳ.permalink}
        >???</CommonLink>
      }
    </footer>
  );

  //  Otherwise, we give the full timestamp and include a link to the
  //  application which posted the status if applicable.
  return (
    <footer className={computedClass}>
      <CommonLink
        className='timestamp'
        href={href}
        title={ℳ.permalink}
      >
        <FormattedDate
          value={datetime}
          hour12={false}
          year='numeric'
          month='short'
          day='2-digit'
          hour='2-digit'
          minute='2-digit'
        />
      </CommonLink>
      <CommonSeparator visible={!!application} />
      {
        application ? (
          <CommonLink href={application.get('website')}>
            {application.get('name')}
          </CommonLink>
        ) : null
      }
      <CommonSeparator visible />
      <CommonIcon
        name={visibilityIcon}
        proportional
        title={visibilityText}
      />
    </footer>
  );
}

//  Props.
ConnectedStatusFooter.propTypes = {
  application: ImmutablePropTypes.map,  //  The application which posted the status
  className: PropTypes.string,
  datetime: PropTypes.instanceOf(Date),  //  The `Date` of the status
  detailed: PropTypes.bool,  //  `true` if the status is detailed
  href: PropTypes.string,  //  The static permalink for the status
  visibility: PropTypes.number,  //  The `VISIBILITY` of the status
  ℳ: PropTypes.func.isRequired,
};
