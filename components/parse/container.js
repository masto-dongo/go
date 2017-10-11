//  <ParseContainer>
//  ================

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { createSelector } from 'reselect';

//  Component imports.
import Parse from '.';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';
import { Emojifier } from 'themes/mastodon-go/util/emojify';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Selector factory.
const ParseContainer = connect(
  go => createSelector(

    //  Inputs.
    state => state.get('emoji'),

    (state, ownProps) => ownProps,

    //  Result.
    (emoji, ownProps) => ({
      emojifier: (() => {
        const data = [];
        return new Emojifier(data);
      })(),
      ...ownProps,
    })
  )
)(Parse);

export default ParseContainer;
