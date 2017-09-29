/*

`<ComposerControls>`
==========================

>   For more information on the contents of this file, please contact:
>
>   - kibigo! [@kibi@glitch.social]

The `<ComposerControls>` component provides controls and meta-information
about the parent `<Composer>` component, such as the character counter
and the submit button.

__Props:__

 -  __`disabled` (`PropTypes.bool`) :__
    Whether or not the submit button is currently disabled.

 -  __`onSubmit` (`PropTypes.func`) :__
    The function to call when the submit button is clicked.

 -  __`text` (`PropTypes.func`) :__
    The plaintext content of the status.

*/

//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

/*

Imports:
--------

*/

//  Package imports
import React from 'react';
import PropTypes from 'prop-types';

//  Stylesheet imports
import './style';

//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
