//  <ProfileMissing>
//  ========

//  For code documentation, please see:
//  https://glitch-soc.github.io/docs/javascript/glitch/profile/missing

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import React from 'react';
import { FormattedMessage } from 'react-intl';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

const ProfileMissing = () => (
  <div className='glitch glitch__profile__missing'>
    <FormattedMessage id='missing_indicator.label' defaultMessage='Not found' />
  </div>
);

export default ProfileMissing;
