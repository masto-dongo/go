/*********************************************************************\
|                                                                     |
|   <CardReference>                                                   |
|   ===============                                                   |
|                                                                     |
|   This creates a reference to an author or a provider for a card.   |
|   At least one of {`href`, `name`} must be provided.                |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import punycode from 'punycode';
import React from 'react';

//  Container imports.
import { ParseContainer } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  This function reliably gets the hostname from a URL.
const getHostname = url => {
  const parser = document.createElement('a');
  parser.href = url;
  return parser.hostname;
};

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function CardReference ({
  className,
  href,
  name,
}) {
  const computedClass = classNames('MASTODON_GO--CARD--REFERENCE', className);

  //  If we have a `href` then we can render a link.
  if (href) {
    return (
      <CommonLink
        className={computedClass}
        href={href}
      >
        <ParseContianer
          text={name || punycode.toUnicode(getHostname(href))}
          type='emoji'
        />
      </CommonLink>
    );
  }

  //  Otherwise, we go with a simple `<span>`.
  if (name) {
    return (
      <span className={computedClass}>
        <ParseContianer
          text={name || punycode.toUnicode(getHostname(href))}
          type='emoji'
        />
      </span>
    );
  }

  //  We return `null` as a last resort.
  return null;
}

CardReference.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  name: PropTypes.string,
};
