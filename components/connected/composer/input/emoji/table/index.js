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
    const {
      autoplay,
      caption,
      className,
      emoji,
    } = this.props;
    const computedClass = classNames('MASTODON_GO--CONNECTED--COMPOSER--INPUT--EMOJI--TABLE', className);
    if (!emoji.length) {
      return null;
    }
    const rows = [[], [], []];
    let index = -1;
    emoji.forEach(function ({
      codepoints,
      href,
      name,
      staticHref,
      str,
      title,
    }) {
      if (codepoints[1] && codepoints[1] >= 0x1F3FB && codepoints[1] <= 0x1F3FF) {
        return;  //  `index` is not incremented if we don't display
      }
      rows[++index % 3].push(
        <td key={index}>
          <CommonButton
            data={str || (name ? ':' + name + ':' : '')}
            onClick={DOMEventInsert}
            passive
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
    });
    return (
      <table className={computedClass}>
        <caption>{caption}</caption>
        <tbody>
          {rows.map(
            (row, index) => <tr key={index}>{row}</tr>
          )}
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
