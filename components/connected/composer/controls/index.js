//  <ConnectedComposerControls>
//  ===========================

//  This component provides the general posting controls for the
//  composer.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  DOM imports.
import {
  DOMListen,
  DOMForget,
} from 'themes/mastodon-go/DOM';

//  Component imports.
import {
  CommonTextButton,
  CommonToggle,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class ConnectedComposerControls extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  State.
    this.state = {
      pooptoot: false,
      quickMode: false,
    };

    //  Function binding.
    const {
      handleAlt,
      handleClick,
      handlePooptoot,
    } = Object.getPrototypeOf(this);
    this.handleAlt = handleAlt.bind(this);
    this.handleClick = handleClick.bind(this);
    this.handlePooptoot = handlePooptoot.bind(this);
  }

  //  On mounting, we attach our alt-key detection listeners.
  componentWillMount () {
    const { handleAlt } = this;
    DOMListen('mousemove', handleAlt);
    document.body.addEventListener('keydown', handleAlt, false);
    document.body.addEventListener('keyup', handleAlt, false);
  }

  //  On unmounting, we remove our listeners.
  componentWillUnmount () {
    const { handleAlt } = this;
    DOMForget('mousemove', handleAlt);
    document.body.removeEventListener('keydown', handleAlt, false);
    document.body.removeEventListener('keyup', handleAlt, false);
  }

  //  This function handles alt-key presses.
  handleAlt ({ altKey }) {
    const { quickMode } = this.state;
    if (altKey && !quickMode) {
      this.setState({ quickMode: true });
    } else if (quickMode) {
      this.setState({ quickMode: false });
    }
  }

  //  This function handles what happens when you click the publish
  //  button.
  handleClick () {
    const {
      onSubmit,
      rehash,
    } = this.props;
    const { quickMode } = this.state;
    if (quickMode) {
      onSubmit();
    } else {
      rehash('#preview');
    }
  }

  //  This function handles pooptooting.
  handlePooptoot (value) {
    this.setState({ pooptoot: !!value });
  }

  //  Rendering.
  render () {
    const {
      handleClick,
      handlePooptoot,
    } = this;
    const {
      attached,
      className,
      disabled,
      local,
      spoiler,
      text,
      ℳ,
    } = this.props;
    const {
      pooptoot,
      quickMode,
    } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--CONTROLS', { disabled }, className);

    const size = ((local ? text + ' 👁' : text) + (spoiler || '')).trim().replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '_').length;

    return (
      <div className={computedClass}>
        <CommonToggle
          active={pooptoot}
          activeIcon='forward'
          activeLabel={ℳ.quickMode}
          compact
          disabled={disabled}
          inactiveIcon='play'
          inactiveLabel={ℳ.slowMode}
          onChange={handlePooptoot}
          title={ℳ.postMode}
        />
        <CommonTextButton
          className='button'
          disabled={disabled || !(text.trim() && size <= 500)}
          icon={pooptoot || quickMode ? 'paper-plane' : 'paper-plane-o'}
          onClick={handleClick}
          role={pooptoot || quickMode ? 'button' : 'link'}
        >
          {pooptoot || quickMode ? ℳ.quick : ℳ.preview}
          {attached ? <span className='attached'>{attached}</span> : null}
          <span
            aria-hidden='true'
            className='filler'
            style={{ width: size > 500 ? '100%' : '' + (100 * size / 500) + '%' }}
          />
        </CommonTextButton>
      </div>
    );
  }

}

//  Props.
ConnectedComposerControls.propTypes = {
  attached: PropTypes.number,  //  The number of attached items
  className: PropTypes.string,
  disabled: PropTypes.bool,  //  `true` if the composer is disabled
  local: PropTypes.bool,  //  `true` if the composed status will be local-only
  onSubmit: PropTypes.func,  //  A function to call to submit the status
  rehash: PropTypes.func,
  spoiler: PropTypes.string,  //  The value of the composer's spoiler
  text: PropTypes.string.isRequired,  //  The value of the composer's contents
  ℳ: PropTypes.func.isRequired,
};

