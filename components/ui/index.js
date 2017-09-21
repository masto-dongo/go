import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import NotificationsContainer from 'mastodon/features/ui/containers/notifications_container';
import LoadingBarContainer from 'mastodon/features/ui/containers/loading_bar_container';
import TabsBar from 'mastodon/features/ui/components/tabs_bar';
import ModalContainer from 'mastodon/features/ui/containers/modal_container';
import { isMobile } from 'mastodon/is_mobile';
import UploadArea from 'mastodon/features/ui/components/upload_area';

import UIColumn from './column';
import UIRoutes from './routes';

export default class UI extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    columns: ImmutablePropTypes.list,
    handler: PropTypes.objectOf(PropTypes.func).isRequired,
    history: PropTypes.object,
    isComposing: PropTypes.bool,
    isWide: PropTypes.bool,
    layout: PropTypes.string,
    navbarUnder: PropTypes.bool,
    systemFontUi: PropTypes.bool,
  };
  state = {
    draggingOver: false,
    width: window.innerWidth,
  };

  handleResize = debounce(() => {
    const { handler } = this.props;

    // The cached heights are no longer accurate, invalidate
    handler.resize();

    this.setState({ width: window.innerWidth });
  }, 500, {
    trailing: true,
  });

  handleDragEnter = (e) => {
    e.preventDefault();

    if (!this.dragTargets) {
      this.dragTargets = [];
    }

    if (this.dragTargets.indexOf(e.target) === -1) {
      this.dragTargets.push(e.target);
    }

    if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
      this.setState({ draggingOver: true });
    }
  }

  handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      e.dataTransfer.dropEffect = 'copy';
    } catch (err) {
      /*  Do nothing  */
    }
  }

  handleDrop = (e) => {
    const { handler } = this.props;

    e.preventDefault();

    this.setState({ draggingOver: false });
    if (e.dataTransfer && e.dataTransfer.files.length === 1) {
      handler.upload(e.dataTransfer.files);
    }
  }

  handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.dragTargets = this.dragTargets.filter(el => el !== e.target && this.node.contains(el));

    if (this.dragTargets.length > 0) return;

    this.setState({ draggingOver: false });
  }

  closeUploadModal = () => {
    this.setState({ draggingOver: false });
  }

  handleServiceWorkerPostMessage = ({ data }) => {
    const { history } = this.props;
    if (!history) return;
    if (data.type === 'navigate') {
      history.push(data.path);
    } else {
      console.warn('Unknown message type:', data.type); // eslint-disable-line no-console
    }
  }

  componentWillMount () {
    const { handler } = this.props;

    window.addEventListener('resize', this.handleResize, { passive: true });
    document.addEventListener('dragenter', this.handleDragEnter, false);
    document.addEventListener('dragover', this.handleDragOver, false);
    document.addEventListener('drop', this.handleDrop, false);
    document.addEventListener('dragleave', this.handleDragLeave, false);
    document.addEventListener('dragend', this.handleDragEnd, false);

    if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerPostMessage);

    handler.refresh();
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.isComposing !== this.props.isComposing) {
      // Avoid expensive update just to toggle a class
      this.node.classList.toggle('is-composing', nextProps.isComposing);
      this.node.classList.toggle('navbar-under', nextProps.navbarUnder);

      return false;
    }

    // Why isn't this working?!?
    // return super.shouldComponentUpdate(nextProps, nextState);
    return true;
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('dragenter', this.handleDragEnter);
    document.removeEventListener('dragover', this.handleDragOver);
    document.removeEventListener('drop', this.handleDrop);
    document.removeEventListener('dragleave', this.handleDragLeave);
    document.removeEventListener('dragend', this.handleDragEnd);
  }

  setRef = (c) => {
    this.node = c;
  }

  render () {
    const {
      children,
      className,
      columns,
      handler,
      history,
      isComposing,
      isWide,
      layout,
      navbarUnder,
      systemFontUi,
      ...others
    } = this.props;
    const { draggingOver, width } = this.state;

    const singleColumn = isMobile(width, layout);
    const columnsClass = layout => {
      switch (layout) {
      case 'single':
        return 'single-column';
      case 'multiple':
        return 'multi-columns';
      default:
        return 'auto-columns';
      }
    };

    const computedClass = classNames('glitch', 'glitch__ui', columnsClass(layout), {
      '_wide': isWide,
      '_system-font': this.props.systemFontUi,
      '_navbar-under': navbarUnder,
    }, className);

    return (
      <div className={computedClass} ref={this.setRef} {...others}>
        {navbarUnder ? null : <TabsBar />}
        {!singleColumn ? columns.map((column, index) => {
          <UIColumn
            history={history}
            index={index}
            key={column.get('uuid')}
            type={column.get('type')}
            meta={(() => {
              try {
                return column.get('meta').toJS();
              } catch (e) {
                return void 0;
              }
            })()}
            uuid={column.get('uuid')}
          />
        }) : null}
        <UIRoutes
          component={UIColumn}
          history={history}
          index={!singleColumn ? columns.size : 0}
        />
        <NotificationsContainer />
        {navbarUnder ? <TabsBar /> : null}
        <LoadingBarContainer className='loading-bar' />
        <ModalContainer />
        <UploadArea active={draggingOver} onClose={this.closeUploadModal} />
      </div>
    );
  }

}
