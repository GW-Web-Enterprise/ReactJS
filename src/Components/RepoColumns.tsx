import { TableCell } from '@material-ui/core';
import { Fragment } from 'react';

export const RepoColumns = () => {
    return (
        <Fragment>
            {/* The 1st column holds the button to toggle the visibility of the repo files  */}
            <TableCell></TableCell>
            <TableCell>
                <strong>Repo name</strong>
            </TableCell>
            <TableCell align="right">
                <strong>Close date and time</strong>
            </TableCell>
            <TableCell align="right">
                <strong>Final date and time</strong>
            </TableCell>
        </Fragment>
    );
};
