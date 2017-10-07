/*

`<ComposerInput>`
==========================

>   For more information on the contents of this file, please contact:
>
>   - kibigo! [@kibi@glitch.social]

The `<ComposerInput>` component allows for the inputting of various
entities (photos, emoji) into the parent `<Composer>` component.

__Props:__

 -  __`active` (`PropTypes.bool`) :__
    Whether or not the submit button is currently available to be
    clicked.

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
