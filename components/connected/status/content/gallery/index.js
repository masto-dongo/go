//  <ConnectedStatusContentGallery>
//  ===============================

//  This component renders the attachments of a status in a nice
//  gallery.

//  * * * * * * *  //

//  Imports:
//  --------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

//  Component imports.
import {
  CommonButton,
  CommonIconButton,
  ConnectedMedia,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class ConnectedStatusContentGallery extends React.PureComponent {

  //  Constructor.
  constructor (props) {
    super(props);

    //  State.
    this.state = { visible: !this.props.sensitive };

    //  Function binding.
    const { handleToggle } = Object.getPrototypeOf(this);
    this.handleToggle = handleToggle.bind(this);
  }

  //  Handles showing and hiding media.
  handleToggle () {
    this.setState({ visible: !this.state.visible });
  }

  //  Renders.
  render () {
    const { handleToggle } = this;
    const {
      className,
      media,
      sensitive,
      ℳ,
    } = this.props;
    const { visible } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--STATUS--CONTENT--GALLERY', 'size-' + media.size, className);

    //  We can only use up to 4 attachments.
    const useäbleAttachments = media.take(4);

    //  Renders the gallery.
    return (
      <div className={computedClass}>
        {visible ? (
          <CommonIconButton
            className='button'
            icon={visible ? 'eye' : 'eye-slash'}
            title={ℳ.hideMedia}
            onClick={handleToggle}
          />
        ) : (
          <CommonButton
            active
            className='curtain'
            title={ℳ.hideMedia}
            onClick={handleToggle}
          >
            <span>
              <strong>{sensitive ? ℳ.sensitive : ℳ.hidden}</strong>
              {ℳ.clickToView}
            </span>
          </CommonButton>
        )}
        {visible ? useäbleAttachments.map(
          attachment => (
            <ConnectedMedia
              key={attachment.get('id')}
              id={attachment.get('id')}
            />
          )
        ) : null}
      </div>
    );
  }

}

//  Props.
ConnectedStatusContentGallery.propTypes = {
  className: PropTypes.string,
  media: ImmutablePropTypes.list.isRequired,  //  A list of media to render in the gallery
  sensitive: PropTypes.bool,  //  `true` if the media is sensitive
  ℳ: PropTypes.func.isRequired,
};
