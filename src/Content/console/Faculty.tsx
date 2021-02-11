import { Button } from '@material-ui/core';
import React, { Fragment, VFC } from 'react';
import { PopoverItem, TabNav } from '../../Components';
import { cloneComponent } from '../../utils';

export const Faculty: VFC = () => {
    return (
        <Fragment>
            {cloneComponent(10)(
                <PopoverItem
                    renderToggle={(toggle, toggleEl) => (
                        <Button
                            variant="outlined"
                            color="primary"
                            ref={toggleEl}
                            onClick={toggle}
                            style={{
                                color: '#1976d2',
                                border: '1px solid rgba(25, 118, 210, 0.5)'
                            }}
                        >
                            Faculty of Math
                        </Button>
                    )}
                    renderPopContent={() => <TabNav />}
                />
            )}
        </Fragment>
    );
};
