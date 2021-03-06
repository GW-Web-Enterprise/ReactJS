import { TableCell, TableHead, TableRow } from '@material-ui/core';

export const RepoTableHead = () => {
    return (
        <TableHead>
            <TableRow>
                {/* The 1st column holds the button to toggle the visibility of the repo list  */}
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
                {/* The last column holds the button to edit and delete a repo */}
                {window.location.pathname === '/console/repos' && <TableCell></TableCell>}
            </TableRow>
        </TableHead>
    );
};
