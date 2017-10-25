//  Package imports
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports
import ConnectedComposerInputMenu from './menu';

//  Stylesheet imports
import './style.scss';

export default class ConnectedComposerInput extends React.PureComponent {

  constructor (props) {
    super(props);

    //  State.
    this.state = { currentTab: 0 };

    //  Function binding.
    const { handleTab } = Object.getPrototypeOf(this);
    this.handleTab = handleTab.bind(this);
  }

  handleTab (index) {
    this.setState({ currentTab: index });
  }

  render () {
    const { handleTab } = this;
    const {
      attachments,
      className,
      onRemove,
      onSensitive,
      onUpload,
      ℳ,
    } = this.props;
    const { currentTab } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--INPUT', { closed: !currentTab }, className);

    return (
      <div className={computedClass}>
        {function () {
          switch (currentTab) {
          default:
            return null;
          }
        }()}
        <ConnectedComposerInputMenu
          onChange={handleTab}
          value={currentTab}
          ℳ={ℳ}
        />
      </div>
    );
  }

}

ConnectedComposerInput.propTypes = {
  attachments: PropTypes.array,
  className: PropTypes.string,
  onRemove: PropTypes.func,
  onSensitive: PropTypes.func,
  onUpload: PropTypes.func,
  ℳ: PropTypes.func.isRequired,
};
