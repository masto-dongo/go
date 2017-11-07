//  <ConnectedParseAccountBio>
//  ==========================

//  We need to format links if they appear—in both the bio and the
//  metadata.  And, of course, we'll use a <ConnectedParse> to handle
//  any emoji.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

//  Component imports.
import ConnectedParseAccountBioParagraph from './paragraph';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ConnectedParseAccountBio ({
  className,
  metadata,
  text,
}) {
  const computedClass = classNames('MASTODON_GO--CONNECTED--PARSE--ACCOUNT_BIO', className);

  //  The `bio` array will hold our content.
  const bio = [];

  //  First, we create paragraphs for our `parsedText`.
  if (text) {
    bio.splice(0, 0, ...text.split('\n\n').map(
      (paragraph, index) => (
        <ConnectedParseAccountBioParagraph
          key={index}
          text={paragraph}
        />
      )
    ));
  }

  //  If we have `metadata`, then we need to process it.
  if (metadata && metadata.size) {
    bio.push(
      <table key={bio.length}>
        <tbody>
          {
            //  We map our metadata arrays into table rows. We use
            //  `parseLines` to make sure our links get parsed.
            metadata.map(
              (data, index) => (
                <tr key={index}>
                  <th scope='row'>
                    <ConnectedParseAccountBioParagraph
                      key={index}
                      text={data.get(0)}
                    />
                  </th>
                  <td>
                    <ConnectedParseAccountBioParagraph
                      key={index}
                      text={data.get(1)}
                    />
                  </td>
                </tr>
              )
            )
          }
        </tbody>
      </table>
    );
  }

  //  Finally, we can render the bio.
  return (
    <div className={computedClass}>{bio}</div>
  );
};

//  Props.
ConnectedParseAccountBio.propTypes = {
  className: PropTypes.string,
  metadata: ImmutablePropTypes.list,  //  The metadata for the account
  text: PropTypes.string,  //  The account bio
};
