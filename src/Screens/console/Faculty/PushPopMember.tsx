import { MembersTabPanel } from '@app/Screens/console/Faculty/MembersTabPanel';
import { SysusersTabPanel } from '@app/Screens/console/Faculty/SysusersTabPanel';
import { Paper, Tab, Tabs } from '@material-ui/core';
import React, { Fragment, useState, VFC } from 'react';

export const PushPopMember: VFC<{ facultyId: string }> = ({ facultyId }) => {
    const [value, setValue] = useState(0);
    const handleChange = (_e: React.ChangeEvent<{}>, newValue: number) => setValue(newValue);
    return (
        <Fragment>
            <Paper square>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs"
                >
                    <Tab label="Faculty members" />
                    <Tab label="System users" />
                </Tabs>
            </Paper>
            <MembersTabPanel value={value} facultyId={facultyId} />
            <SysusersTabPanel value={value} facultyId={facultyId} />
        </Fragment>
    );
};
