//  <Status>
//  ========

//  For more information, please contact:
//  @kibi@glitch.social

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';

//  Container imports.
import { AccountContainer } from 'themes/mastodon-go/components';

//  Common imports.
import {
  CommonButton,
  CommonObservable,
} from 'themes/mastodon-go/components';

//  Our imports.
import StatusActionBar from './action_bar';
import StatusContent from './content';
import StatusFooter from './footer';
import StatusNav from './nav';
import StatusPrepend from './prepend';

//  Stylesheet imports.
import './style';

//  Other imports.
import {
  POST_TYPE,
  VISIBILITY,
} from 'themes/mastodon-go/util/constants';

//  * * * * * * * //

//  The component
//  -------------

export default class Status extends React.PureComponent {

  //  Props, and state.
  static propTypes = {
    className: PropTypes.string,
    containerId: PropTypes.string,
    detailed: PropTypes.bool,
    filterRegex: PropTypes.string,
    hideIf: PropTypes.number,
    history: PropTypes.object,
    id: PropTypes.string.isRequired,
    observer: PropTypes.object,
    setDetail: PropTypes.func,
    '🛄': PropTypes.shape({ intl: PropTypes.object.isRequired }).isRequired,
    '💪': PropTypes.objectOf(PropTypes.func).isRequired,
    '🏪': PropTypes.shape({
      account: PropTypes.string.isRequired,
      application: ImmutablePropTypes.map,
      card: ImmutablePropTypes.map,
      comrade: PropTypes.string,
      content: ImmutablePropTypes.map,
      datetime: PropTypes.instanceOf(Date),
      href: PropTypes.string,
      inReplyTo: PropTypes.map,
      is: ImmutablePropTypes.map.isRequired,
      me: PropTypes.string,
      media: ImmutablePropTypes.list,
      mentions: ImmutablePropTypes.list,
      sensitive: PropTypes.bool,
      spoiler: PropTypes.string,
      tags: ImmutablePropTypes.list,
      type: PropTypes.number,
      visibility: PropTypes.number.isRequired,
    }).isRequired,
  }
  state = {
    contentVisible: !this.props.spoiler,
  }

  //  Prior to mounting, we fetch the status's card if this is a
  //  detailed status and we don't already have it.
  componentWillMount () {
    const {
      detailed,
      '💪': { card: handleCard },
      '🏪': { card },
    } = this.props;
    if (!card && detailed) {
      handleCard();
    }
  }

  //  If our component is about to become detailed, we request its card
  //  if we don't have it.
  componentWillUpdate (nextProps) {
    const {
      detailed,
      '💪': { card: handleCard },
    } = this.props;
    if (!nextProps['🏪'].card && nextProps.detailed && !detailed) {
      handleCard();
    }
  }

  //  `setExpansion` handles expanding and collapsing spoilers.
  setExpansion = (value) => {
    const { detailed } = this.props;
    const { contentVisible } = this.state;
    switch (true) {

    //  A value of `null` or `undefined` flips the state.
    case value === undefined || value === null:
      this.setState({ contentVisible: !contentVisible });
      break;

    //  A value of `false` means that the status should be collapsed.
    case !value:
      this.setState({ contentVisible: false });
      break;

    //  A value of `true` means that the status should be expanded.
    case !!value:
      this.setState({ contentVisible: true });
      break;
    }
  }

  //  `handleClick()` handles all clicking stuff. We route links and
  //  make our status detailed if it isn't already.
  handleClick = (e) => {
    const {
      detailed,
      id,
      setDetail,
    } = this.props;
    if (setDetail && !(e.button || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)) {
      setDetail(detailed ? null : id);
      e.preventDefault();
    }
  }

  //  Puts our element on the screen.
  render () {
    const {
      handleClick,
      setExpansion,
    } = this;
    const {
      className,
      containerId,
      detailed,
      filterRegex,
      hideIf,
      history,
      id,
      observer,
      setDetail,
      '🛄': { intl },
      '💪': handler,
      '🏪': {
        account,
        application,
        card,
        comrade,
        content,
        datetime,
        href,
        inReplyTo,
        is,
        me,
        media,
        mentions,
        sensitive,
        spoiler,
        tags,
        type,
        visibility,
      },
      ...rest
    } = this.props;
    const { contentVisible } = this.state;

    const computedClass = classNames('MASTODON_GO--STATUS', {
      detailed,
      direct: visibility === VISIBILITY.DIRECT,
    }, className);

    const regex = function (exp) {
      try {
        return exp && new RegExp(exp, 'i');
      } catch (e) {}
    }(filterRegex);

    const searchText = spoiler + '\n\n' + content.get('plain').replace(/\ufdd0([^]*)\ufdd1([^]*)\ufdd2/g, '$1');

    if (hideIf & type || regex && account !== me && regex.test(searchText)) {
      return null;
    }

    //  We can now render our status!
    return (
      <CommonObservable
        className={computedClass}
        id={containerId || id}
        observer={observer}
        searchText={searchText}
        {...rest}
      >
        <StatusPrepend
          comrade={comrade || inReplyTo.account}
          type={POST_TYPE}
        />
        <AccountContainer
          comrade={comrade}
          id={account}
          small
        />
        <StatusContent
          card={card}
          content={content.get('plain')}
          contentVisible={contentVisible}
          detailed={detailed}
          handler={handler}
          history={history}
          intl={intl}
          media={media}
          mentions={mentions}
          onClick={handleClick}
          setExpansion={setExpansion}
          tags={tags}
        />
        <StatusFooter
          application={application}
          datetime={datetime}
          detailed={detailed}
          href={href}
          intl={intl}
          visibility={visibility}
        />
        <StatusActionBar
          detailed={detailed}
          handler={handler}
          history={history}
          intl={intl}
          is={is}
          me={me}
          setDetail={setDetail}
          visibility={visibility}
        />
        {detailed ? (
          <StatusNav id={id} intl={intl} />
        ) : null}
      </CommonObservable>
    );

  }

}
