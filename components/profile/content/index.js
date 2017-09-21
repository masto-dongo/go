import classNames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl';

import emojify from 'mastodon/emoji';

import processBio from 'glitch/util/bio_metadata';

messages = defineMessages({
  disclaimer:
    { id: 'account.disclaimer_full', defaultMessage: 'Information below may reflect the user\'s profile incompletely.' },
  viewFullProfile:
    { id: 'account.view_full_profile', defaultMessage: 'View full profile' },
});

const ProfileMetadata = ({
  className,
  local,
  href,
  note,
}) => {
  const computedClass = classNames('glitch', 'glitch__profile__metadata', className);
  const { text, metadata } = processBio(note);

  return (
    <div className={computedClass}>
      {!local ? (
        <div className='content\disclaimer'>
          <FormattedMessage {...messages.disclaimer} />
          {' '}
          <CommonLink
            className='content\link'
            href={href}
          ><FormattedMessage {...messages.viewFullProfile} /></CommonLink>
        </div>
      ) : null}
      {emojify(text)}
      {metadata && metadata.length ? (
        <table className='content\metadata'>
          <tbody>
            {(() => {
              let data = [];
              for (let i = 0; i < metadata.length; i++) {
                data.push(
                  <tr key={i}>
                    <th scope='row'><div dangerouslySetInnerHTML={{ __html: emojify(metadata[i][0]) }} /></th>
                    <td><div dangerouslySetInnerHTML={{ __html: emojify(metadata[i][1]) }} /></td>
                  </tr>
                );
              }
              return data;
            })()}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

ProfileMetadata.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  local: PropTypes.bool,
  note: PropTypes.string,
}

return ProfileMetadata;
