//  <RoutedUIModal>
//  ===============

//  This component creates a modal which drops down in front of the
//  column, like a drawer/sheet.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

//  Event imports.
import { GOClose } from 'flavours/go/events';

//  Component imports.
import { CommonIconButton } from 'flavours/go/components';

//  Stylesheet imports.
import './style.scss';

export default function RoutedUIModal ({
  children,
  className,
}) {
  const computedClass = classNames('MASTODON_GO--ROUTED--UI--MODAL', className);

  return (
    <div className={computedClass}>
      {children}
      <footer>
        <CommonIconButton
          icon='times'
          onClick={GOClose}
        />
      </footer>
    </div>
  );
};

RoutedUIModal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
