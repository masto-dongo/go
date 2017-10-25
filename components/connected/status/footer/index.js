//  <StatusFooter>
//  ==============

//  For more information, please contact:
//  @kibi@glitch.social

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

export default class StatusFooter extends React.PureComponent {

  //  Props.
  static propTypes = {
    application: ImmutablePropTypes.map,
    className: PropTypes.string,
    datetime: PropTypes.instanceOf(Date),
    detailed: PropTypes.bool,
    href: PropTypes.string,
    visibility: PropTypes.number,
    ℳ: PropTypes.func.isRequired,
  };

  //  Rendering.
  render () {
    const {
      application,
      className,
      datetime,
      detailed,
      href,
      visibility,
      ℳ,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--STATUS--FOOTER', { detailed }, className);

    let visibilityIcon;
    let visibilityText;
    switch (true) {
    case (visibility & VISIBILITY.PUBLIC) === VISIBILITY.PUBLIC:
      visibilityIcon = 'globe';
      visibilityText = ℳ.public;
      break;
    case (visibility & VISIBILITY.UNLISTED) === VISIBILITY.UNLISTED:
      visibilityIcon = 'unlock-alt';
      visibilityText = ℳ.unlisted;
      break;
    case (visibility & VISIBILITY.PRIVATE) === VISIBILITY.PRIVATE:
      visibilityIcon = 'lock';
      visibilityText = ℳ.private;
      break;
    case (visibility & VISIBILITY.DIRECT) === VISIBILITY.DIRECT:
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
      <footer
        className={computedClass}
        {...rest}
      >
        <CommonIcon
          name={visibilityIcon}
          proportional
          title={visibilityText}
        />
        <CommonLink
          className='timestamp'
          href={href}
          title={ℳ.permalink}
        >
          {datetime.toISOString()}
        </CommonLink>
      </footer>
    );

    //  Otherwise, we give the full timestamp and include a link to the
    //  application which posted the status if applicable.
    return (
      <footer
        className={computedClass}
        {...rest}
      >
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

}
