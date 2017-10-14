/*********************************************************************\
|                                                                     |
|   <AvatarContainer>                                                 |
|   =================                                                 |
|                                                                     |
|   Our contiainer is exceedingly simple—we just grab the source of   |
|   each account's avatar, as well as their handles (for use in our   |
|   image `alt`s).                                                    |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import { createStructuredSelector } from 'reselect';

//  Component imports.
import Avatar from '.';

//  Other imports.
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Building our store.
export default connect(createStructuredSelector({
  accountAt: (state, { account }) => state.getIn(['account', account, 'at']),
  accountSrc: (state, { account }) => state.getIn(['account', account, 'avatar']),
  autoplay: (state, { id }) => state.getIn(['meta', 'autoplay']),
  comradeAt: (state, { comrade }) => comrade ? state.getIn(['account', comrade, 'at']) : null,
  comradeSrc: (state, { comrade }) => comrade ? state.getIn(['account', comrade, 'avatar']) : null,
}))(Avatar);
