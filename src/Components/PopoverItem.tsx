import { Box, Popover, PopoverOrigin } from '@material-ui/core';
import React, { Fragment, MutableRefObject, ReactNode, useRef, useState, VFC } from 'react';
interface PopoverItemProps {
    /** A 'render prop' that renders the JSX element to toggle the Popover */
    renderToggle: (toggle: () => void, toggleEl: MutableRefObject<null>) => ReactNode;
    /** A 'render prop' that returns the actual popover content */
    renderPopContent: (closePopContent: () => void) => ReactNode;
    placement: Placement;
    padding?: number;
}

type PopoverPos = { anchorOrigin: PopoverOrigin; transformOrigin: PopoverOrigin };
type Placement = 'top' | 'bottom' | 'bottomRight';
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
    },
    bottomRight: {
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
        },
        transformOrigin: {
            vertical: 'top',
            horizontal: 'right'
        }
    }
};

export const PopoverItem: VFC<PopoverItemProps> = ({ renderToggle, renderPopContent, placement, padding = 16 }) => {
    const toggleEl = useRef(null);
    const [open, setOpen] = useState(false);
    return (
        <Fragment>
            {renderToggle(() => setOpen(!open), toggleEl)}
            <Popover open={open} anchorEl={toggleEl.current} onClose={() => setOpen(false)} {...pos[placement]}>
                <Box style={{ padding }}>{renderPopContent(() => setOpen(false))}</Box>
            </Popover>
        </Fragment>
    );
};
