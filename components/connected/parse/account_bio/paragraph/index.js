/*********************************************************************\
|                                                                     |
|   <ParseAccountBioParagraph>                                        |
|   ==========================                                        |
|                                                                     |
|   This simple functional component converts a plain-text bio into   |
|   a React paragraph that we can use.  It handles link delimiters,   |
|   as well as line-breaks, but not paragraphs (it expects a single   |
|   paragraph as input.                                               |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Component imports.
import {
  CommonLink,
  ConnectedParse,
} from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ConnectedParseAccountBioParagraph ({
  className,
  text,
}) {
  const computedClass = classNames('MASTODON_GO--CONNECTED--PARSE--ACCOUNT_BIO--PARAGRAPH', className);

  //  Rendering.
  return (
    <p className={computedClass}>
      {
        text.split('\n').reduce(
          (pContents, line, lineNº, lines) => {

            //  First, we need to parse our line for any links.
            let linkMatch;
            while ((linkMatch = line.match(/([^]*?)\uFDD0([^]*)\uFDD1([^]*)\uFDD2([^]*)/))) {

              //  If there is text before the link, we push it.
              if (linkMatch[1]) {
                pContents.push(
                  <ConnectedParse
                    key={pContents.length}
                    text={linkMatch[1]}
                    type='emoji'
                  />
                );
              }

              //  Next, we push our link.
              pContents.push(
                <CommonLink
                  href={linkMatch[3]}
                  key={pContents.length}
                >
                  <ConnectedParse
                    text={linkMatch[2]}
                    type='emoji'
                  />
                </CommonLink>
              );

              //  Finally, we reset our `line` to our remaining contents.
              line = linkMatch[4];
            }

            //  If any text remains in our line, we push it.
            if (line) {
              pContents.push(
                <ConnectedParse
                  key={pContents.length}
                  text={line}
                  type='emoji'
                />
              );
            }

            //  We push a line-break if this isn't the final line and return the
            //  paragraph contents.
            if (lineNº !== lines.length - 1) {
              pContents.push(<br key={pContents.length} />);
            }
            return pContents;
          },
          []
        )
      }
    </p>
  );
};

//  Props.
ConnectedParseAccountBioParagraph.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
};
