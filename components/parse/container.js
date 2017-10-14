/*********************************************************************\
|                                                                     |
|   <ParseContainer>                                                  |
|   ================                                                  |
|                                                                     |
|   The only thing the parser needs access to is our emoji.           |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import { createSelector } from 'reselect';

//  Component imports.
import Parse from '.';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Building our store.
export default connect(createStructuredSelector({
  emoji: state => state.get('emoji'),
}))(Parse);
