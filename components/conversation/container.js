//  <ConversationContainer>
//  =======================

//  For code documentation, please see:
//  https://glitch-soc.github.io/docs/javascript/glitch/conversation/container

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { connect } from 'react-redux';

//  Our imports.
import Conversation from '.';
import { fetchContext } from 'glitch/actions/statuses';

//  * * * * * * *  //

//  State mapping
//  -------------

const mapStateToProps = (state, { id }) => {
  return {
    ancestors: state.getIn(['contexts', 'ancestors', id]),
    descendants: state.getIn(['contexts', 'descendants', id]),
  };
};

//  * * * * * * *  //

//  Dispatch mapping
//  ----------------

const mapDispatchToProps = (dispatch) => ({
  handler: {
    fetch (id) {
      dispatch(fetchContext(id));
    },
  },
});

//  * * * * * * *  //

//  Connecting
//  ----------

export default connect(mapStateToProps, mapDispatchToProps)(Conversation);
