import { Icon } from '@material-ui/core';
import React, { VFC } from 'react';

/**
 * @example src is equal to import googleLogo from '../../assets/google-color.svg';
 */
export const InlineIcon: VFC<{ src: string }> = ({ src }) => {
    return (
        <Icon style={{ textAlign: 'center' }}>
            <img src={src} alt="icon" style={{ display: 'flex', height: 'inherit', width: 'inherit' }} />
        </Icon>
    );
};
