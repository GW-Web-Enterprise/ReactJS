import { Box, Popover, PopoverOrigin } from '@material-ui/core';
import React, { Fragment, MutableRefObject, ReactNode, useRef, useState, VFC } from 'react';
interface PopoverItemProps {
    /** A 'render prop' that renders the JSX element to toggle the Popover */
    renderToggle: (toggle: () => void, toggleEl: MutableRefObject<null>) => ReactNode;
    /** A 'render prop' that returns the actual popover content */
    renderPopContent: (toggle: () => void) => ReactNode;
    placement: 'top' | 'bottom';
}

type PopoverPos = { anchorOrigin: PopoverOrigin; transformOrigin: PopoverOrigin };
type Placement = 'top' | 'bottom';
const pos: Record<Placement, PopoverPos> = {
    top: {
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
        },
        transformOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
        }
    },
    bottom: {
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center'
        },
        transformOrigin: {
            vertical: 'top',
            horizontal: 'center'
        }
    }
};

export const PopoverItem: VFC<PopoverItemProps> = ({ renderToggle, renderPopContent, placement }) => {
    const toggleEl = useRef(null);
    const [open, setOpen] = useState(false);
    return (
        <Fragment>
            {renderToggle(() => setOpen(!open), toggleEl)}
            <Popover open={open} anchorEl={toggleEl.current} onClose={() => setOpen(false)} {...pos[placement]}>
                <Box style={{ padding: '16px' }}>{renderPopContent(() => setOpen(!open))}</Box>
            </Popover>
        </Fragment>
    );
};
