import { Box } from '@material-ui/core';
import { ReactNode, VFC } from 'react';

type TabPanelProps = { children?: ReactNode; index: number; value: number };
/** A tab content for each MUI \<Tab> component
 * @example
 *   <Paper square>
        <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs"
        >
            <Tab label="Tab title 1" />
            <Tab label="Tab title 2" />
        </Tabs>
    </Paper>
    <TabPanel value={value} index={0}>Some JSX here</TabPanel>
    <TabPanel value={value} index={1}>Some JSX here</TabPanel>
 */
export const TabPanel: VFC<TabPanelProps> = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box p={1}>{children}</Box>}
        </div>
    );
};
