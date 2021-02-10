import { Box, Popover } from '@material-ui/core';
import React, { MutableRefObject, ReactNode, useRef, useState, VFC } from 'react';
interface PopoverItemProps {
    children: ReactNode;
    /** A 'render prop' renders the JSX element that toggles the Popover when clicked */
    renderToggle: (toggle: () => void, toggleEl: MutableRefObject<null>) => JSX.Element;
}

export const PopoverItem: VFC<PopoverItemProps> = ({ children, renderToggle }) => {
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
                <Box style={{ padding: '16px' }}>{children}</Box>
            </Popover>
        </Box>
    );
};
