/*

`<ComposerOptionsAdvanced>`
==========================

>   For more information on the contents of this file, please contact:
>
>   - surinna [@srn@dev.glitch.social]

This adds an advanced options dropdown to the toot compose box, for
toggles that don't necessarily fit elsewhere.

__Props:__

 -  __`values` (`ImmutablePropTypes.contains(…).isRequired`) :__
    An Immutable map with the following values:

     -  __`do_not_federate` (`PropTypes.bool.isRequired`) :__
        Specifies whether or not to federate the status.

 -  __`onChange` (`PropTypes.func.isRequired`) :__
    The function to call when a toggle is changed. We pass this from
    our container to the toggle.

 -  __`intl` (`PropTypes.object.isRequired`) :__
    Our internationalization object, inserted by `@injectIntl`.

__State:__

 -  __`open` :__
    This tells whether the dropdown is currently open or closed.

*/

//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

/*

Imports:
--------

*/

//  Package imports
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { injectIntl, defineMessages } from 'react-intl';
import classNames from 'classnames';

//  Mastodon imports
import IconButton from '../../../../mastodon/components/icon_button';

//  Our imports
import ComposerOptionsAdvancedToggle from './toggle';

//  Stylesheet imports
import './style';

//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

/*

Inital setup:
-------------

The `messages` constant is used to define any messages that we need
from inside props. These are the various titles and labels on our
toggles.

`iconStyle` styles the icon used for the dropdown button.

*/

const messages = defineMessages({
  local_only_short :
    { id: 'advanced_options.local_only_short', defaultMessage: 'Local-only' },
  local_only_long  :
    { id: 'advanced_options.local_only_long', defaultMessage: 'Do not post to other instances' },
  icon_title       :
    { id: 'advanced_options.icon_title', defaultMessage: 'Advanced options' },
});

const iconStyle = {
  height     : null,
  lineHeight : '27px',
};

//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

/*

Implementation:
---------------

*/

@injectIntl
export default class ComposerOptionsAdvanced extends React.PureComponent {

  static propTypes = {
    values   : ImmutablePropTypes.contains({
      do_not_federate : PropTypes.bool.isRequired,
    }).isRequired,
    onChange : PropTypes.func.isRequired,
    intl     : PropTypes.object.isRequired,
  };
  state = {
    open: false,
  };

/*

###  Toggling the dropdown

`onToggleDropdown()` toggles the opening and closing of the advanced
options dropdown. `onGlobalClick()` closes the dropdown for us if the
user clicks elsewhere on the screen.

*/

  onToggleDropdown = () => {
    this.setState({ open: !this.state.open });
  };

  onGlobalClick = (e) => {
    if (e.target !== this.node && !this.node.contains(e.target) && this.state.open) {
      this.setState({ open: false });
    }
  }

/*

###  Mounting and unmounting the component

We add our event listeners on mount, and remove them on unmount.

*/

  componentDidMount () {
    window.addEventListener('click', this.onGlobalClick);
    window.addEventListener('touchstart', this.onGlobalClick);
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.onGlobalClick);
    window.removeEventListener('touchstart', this.onGlobalClick);
  }

/*

###  Getting a reference to our node

`setRef()` stores a reference to the dropdown's `<div> in `this.node`.

*/

  setRef = (c) => {
    this.node = c;
  }

/*

###  Rendering the component

`render()` actually puts our component on the screen.

*/

  render () {
    const { open } = this.state;
    const { intl, values } = this.props;

/*

The `options` array provides all of the available advanced options
alongside their icon, text, and name.

*/
    const options = [
      { icon: 'wifi', shortText: messages.local_only_short, longText: messages.local_only_long, name: 'do_not_federate' },
    ];

/*

`anyEnabled` tells us if any of our advanced options have been enabled.

*/

    const anyEnabled = values.some((enabled) => enabled);

/*

`optionElems` takes our `options` and creates
`<ComposerOptionsAdvancedToggle>`s out of them. We use the `name` of the
toggle as its `key` so that React can keep track of it.

*/

    const optionElems = options.map((option) => {
      return (
        <ComposerOptionsAdvancedToggle
          onChange={this.props.onChange}
          active={values.get(option.name)}
          key={option.name}
          name={option.name}
          shortText={intl.formatMessage(option.shortText)}
          longText={intl.formatMessage(option.longText)}
        />
      );
    });

/*

`className` gives the class names for our component.

*/

className = classNames('glitch', 'composer__options__advanced', {
  open,
  active: anyEnabled,
});

/*

Finally, we can render our component.

*/

    return (
      <div ref={this.setRef} className={className}>
        <IconButton
          title={intl.formatMessage(messages.icon_title)}
          icon='ellipsis-h'
          active={open || anyEnabled}
          size={18}
          style={iconStyle}
          onClick={this.onToggleDropdown}
        />
        <div className='dropdown'>
          {optionElems}
        </div>
      </div>
    );
  }

}
