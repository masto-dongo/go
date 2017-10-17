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
import { createStructuredSelector } from 'reselect';

//  Component imports.
import Parse from '.';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Building our store.
export default connect(createStructuredSelector({
  emojos: state => state.get('emoji'),
}))(Parse);
