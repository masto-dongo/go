//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';

//  Common imports.
import { CommonButton } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

const messages = defineMessages({
  preview: {
    defaultMessage: 'Configure',
    id: 'composer.preview',
  },
  quick: {
    defaultMessage: 'Quick toot',
    id: 'composer.quick',
  },
});

export default class DrawerComposerControls extends React.PureComponent {

  static propTypes = {
    activeRoute: PropTypes.bool,
    attached: PropTypes.number,
    className: PropTypes.string,
    history: PropTypes.object,
    intl: PropTypes.object.isRequired,
    onSetHash: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  handlePreview = () => {
    const { onSetHash } = this.props;
    if (onSetHash) {
      onSetHash('#preview');
    }
  }

  render () {
    const { handlePreview } = this;
    const {
      activeRoute,
      attached,
      className,
      history,
      intl,
      onSetHash,
      onSubmit,
      ...rest
    } = this.props;
    const computedClass = classNames('MASTODON_GO--DRAWER--COMPOSER--CONTROLS', className);

    return (
      <div
        className={computedClass}
        {...rest}
      >
        <CommonButton
          destination={activeRoute ? '#preview' : undefined}
          history={history}
          onClick={!activeRoute ? handlePreview : undefined}
          title={intl.formatMessage(messages.preview)}
          showTitle
        />
        <CommonButton
          onClick={onSubmit}
          icon='paper-plane-o'
          title={intl.formatMessage(messages.quick)}
          showTitle
        >{attached || true ? <span class='attached'>{attached}</span> : null}</CommonButton>
      </div>
    )
  }

}


