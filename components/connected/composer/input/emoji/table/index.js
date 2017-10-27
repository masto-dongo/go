//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  DOM imports.
import { DOMEventInsert } from 'themes/mastodon-go/DOM';

//  Common imports.
import {
  CommonButton,
  CommonImage,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  Other imports.
import { Emoji } from 'themes/mastodon-go/util/emojify';

//  * * * * * * *  //

//  The component
//  -------------

export default class ConnectedComposerInputEmojiTable extends React.PureComponent {

  constructor (props) {
    super(props);
  }

  render () {
    const { clicks } = this;
    const {
      autoplay,
      caption,
      className,
      emoji,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--INPUT--EMOJI--TABLE', className);
    return (
      <table className={computedClass}>
        <caption>{caption}</caption>
        <tbody>
          {function () {
            const result = [];
            let i = 0;
            while (i < 3) {
              result.push (
                <tr key={i}>
                  {emoji.map(function ({
                    href,
                    name,
                    staticHref,
                    str,
                    title,
                  }, index) {
                    if (index % 3 === i++) {
                      return (
                        <td key={index}>
                          <CommonButton
                            data={str || (name ? ':' + name + ':' : '')}
                            onClick={DOMEventInsert}
                          >
                            <CommonImage
                              animatedSrc={href}
                              alt={str || (name ? ':' + name + ':' : title)}
                              autoplay={autoplay}
                              className='emoji'
                              description={title || name || null}
                              staticSrc={staticHref}
                            />
                          </CommonButton>
                        </td>
                      );
                    }
                    return null;
                  })}
                </tr>
              );
            }
            return result;
          }()}
        </tbody>
      </table>
    );
  }

}

//  Props.
ConnectedComposerInputEmojiTable.propTypes = {
  autoplay: PropTypes.bool,
  caption: PropTypes.node,
  className: PropTypes.string,
  emoji: PropTypes.arrayOf(PropTypes.instanceOf(Emoji)),
};
