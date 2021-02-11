import { Box, Popover } from '@material-ui/core';
import React, { MutableRefObject, useRef, useState, VFC } from 'react';
interface PopoverItemProps {
    /** A 'render prop' that renders the JSX element to toggle the Popover */
    renderToggle: (toggle: () => void, toggleEl: MutableRefObject<null>) => JSX.Element;
    /** A 'render prop' that returns the actual popover content */
    renderPopContent: () => JSX.Element;
}

export const PopoverItem: VFC<PopoverItemProps> = ({ renderToggle, renderPopContent }) => {
    const toggleEl = useRef(null);
    const [open, setOpen] = useState(false);

    return (
        <Box m={1} display="inline-block">
            {renderToggle(() => setOpen(!open), toggleEl)}
            <Popover
                open={open}
                anchorEl={toggleEl.current}
                onClose={() => setOpen(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
            >
                <Box style={{ padding: '16px' }}>{renderPopContent()}</Box>
            </Popover>
        </Box>
    );
};
