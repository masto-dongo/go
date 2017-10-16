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

//  Container imports.
import { ParseContainer } from 'themes/mastodon-go/components';

//  Common imports.
import { CommonLink } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ParseAccountBioParagraph ({
  className,
  text,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--PARSE--ACCOUNT_BIO--PARAGRAPH', className);

  //  Rendering.
  return (
    <p
      className={computedClass}
      {...rest}
    >
      {
        text.split('\n').reduce(
          (pContents, line, lineNº, lines) => {

            //  First, we need to parse our line for any links.
            let linkMatch;
            while ((linkMatch = line.match(/([^]*?)\uFDD0([^]*)\uFDD1([^]*)\uFDD2([^]*)/))) {

              //  If there is text before the link, we push it.
              if (linkMatch[1]) {
                pContents.push(
                  <ParseContainer
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
                  <ParseContainer
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
                <ParseContainer
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
ParseStatusContent.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
};
