//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  DOM imports.
import { DOMEventInsert } from 'themes/mastodon-go/DOM';

//  Common imports.
import { CommonButton } from 'themes/mastodon-go/components';

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
    const { emoji } = this.props;

    this.clicks = emoji.map(
      ({ name, str }) => DOMEventInsert.bind(this, str || ':' + name + ':')
    );
  }

  render () {
    const { clicks } = this;
    const {
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
            while (i++ < 4) {
              result.push (
                <tr key={i}>
                  {emoji.map(function ({
                    href,
                    name,
                    staticHref,
                    str,
                    title,
                  }, index) {
                    if (index % 4 === 0) {
                      return (
                        <td key={index}>
                          <CommonButton onClick={clicks[index]}>
                            <img
                              animatedSrc={href}
                              alt={str || title || name}
                              autoplay={autoplay}
                              className='emoji'
                              description={title || name}
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
ConnectedComposerInputEmoji.propTypes = {
  autoplay: PropTypes.bool,
  caption: PropTypes.node,
  className: PropTypes.string,
  emoji: PropTypes.arrayOf(PropTypes.instanceOf(Emoji)),
};
