import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import { CommonButton } from 'themes/mastodon_go/components';

class CommonDropdown extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string,
  };
  state = { expanded: false };

  handleClick = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  }

  handleDocumentClick = ({ target }) => {
    const { node } = this;
    if (node && !node.contains(e.target)) {
      this.props.onClose();
    }
  }

  handleKeyDown = { key } => {
    switch (key) {
    case 'Escape':
      this.handleClose();
      break;
    }
  }

  componentDidMount () {
    const { handleDocumentClick } = this;
    document.addEventListener('click', handleDocumentClick);
  }
  componentWillUnmount () {
    const { handleDocumentClick } = this;
    document.removeEventListener('click', handleDocumentClick);
  }

  setRef = c => this.node = c;

  render () {
    const {
      handleClick,
      handleKeyDown,
    } = this;
    const {
      children,
      className,
      disabled,
      icon,
      title,
      ...rest
    } = this.props;
    const { expanded } = this.state;
    const computedClass = classNames('MASTODON_GO--COMMON--DROPDOWN', className);

    return (
      <div
        className={computedClass}
        onKeyDown={handleKeyDown}
      >
        <CommonButton
          active={expanded}
          disabled={disabled}
          icon={icon}
          onClick={handleClick}
          title={title}
        />
        {expanded && !disabled ? (
          <div className='menu'>{children}</div>
        ) : null}
      </div>
    );
  }

}
