//  CONNECT:MAKE_MESSAGES
//  =====================

//  Package imports.
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

//  `makeMessages()` creates our `ℳ()` function from `intl` and a
//  `messager` object.
function makeMessages (intl, messager) {
  let ℳ;

  //  Assuming we have `intl`, we can define our `messages`
  //  function.
  if (intl && messager) {

    //  This function gets our internationalization messages.
    ℳ = function (obj, withValues) {

      //  If we are given a string, we return a string.
      if (obj instanceof String || typeof obj === 'string') {
        return !values ? ℳ[obj] : intl.formatMessage(messager[name].id, withValues);
      }

      //  Otherwise, we assume that we're being called via JSX and
      //  respond as a React component.
      const {
        name,
        values,
      } = obj;
      return name ? <FormattedMessage {...messager[name]} values={values} /> : null;
    };

    //  `messages` props.
    ℳ.propTypes = {
      name: PropTypes.string.isRequired,
      values: PropTypes.object,
    };

    //  This predefines our (simple) messages.  This will give us quick
    //  access to them later as well.
    let name;
    for (name in messager) {
      Object.defineProperty(ℳ, name, { value: /(?:\\\\|[^\\]|^){[^]*?(?:\\\\|[^\\])}/.test(messager[name].defaultMessage) ? messager[name].id : intl.formatMessage(messager[name]) });
    }
  }

  //  Return.
  return ℳ;
}
