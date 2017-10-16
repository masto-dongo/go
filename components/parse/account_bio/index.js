/*********************************************************************\
|                                                                     |
|   <ParseAccountBio>                                                 |
|   =================                                                 |
|                                                                     |
|   Because Mastodon's API gives us HTML and not plain-text, we are   |
|   forced to do a fair bit of HTML parsing in order to process the   |
|   bio frontmatter.  Additionally, we need to format links if they   |
|   appear—in both the bio and the metadata.  And, of course, we'll   |
|   use a <ParseContainer> to handle any emoji.                       |
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
import ImmutablePropTypes from 'react-immutable-proptypes';

//  Component imports.
import ParseAccountBioParagraph from '.';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function ParseAccountBio ({
  className,
  metadata,
  text,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--PARSE--ACCOUNT_BIO', className);

  //  The `bio` array will hold our content.
  const bio = [];

  //  First, we create paragraphs for our `parsedText`.
  if (text) {
    bio.concat(text.split('\n\n').map(
      (paragraph, index) => (
        <ParseAccountBioParagraph
          key={index}
          text={paragraph}
        />
      )
    ));
  }

  //  If we have `metadata`, then we need to process it.
  if (metadata) {
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
                    <ParseAccountBioParagraph
                      key={index}
                      text={data.get(0)}
                    />
                  </th>
                  <td>
                    <ParseAccountBioParagraph
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
    <div
      className={computedClass}
      {...rest}
    >{bio}</div>
  );
};

//  Props.
ParseStatusContent.propTypes = {
  className: PropTypes.string,
  metadata: ImmutablePropTypes.map,
  text: PropTypes.string,
};
