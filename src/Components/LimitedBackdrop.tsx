import { Backdrop, withStyles } from '@material-ui/core';

/** A backdrop that overlays a single component rather than the entire screen */
export const LimitedBackdrop = withStyles({
    root: {
        position: 'absolute',
        top: 0,
        left: 0,
        background: '#dcdcdc',
        opacity: '0.9 !important',
        cursor: 'wait',
        width: '100%',
        height: '100%',
        zIndex: 1200
    }
})(Backdrop);
