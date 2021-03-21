import { Box } from '@material-ui/core';

export const STATUS_TO_JSX = {
    pending: (
        <Box color="info.main" display="inline" fontSize="fontSize">
            pending
        </Box>
    ),
    approved: (
        <Box color="success.main" display="inline" fontSize="fontSize">
            approved
        </Box>
    ),
    rejected: (
        <Box color="error.main" display="inline" fontSize="fontSize">
            rejected
        </Box>
    )
};
