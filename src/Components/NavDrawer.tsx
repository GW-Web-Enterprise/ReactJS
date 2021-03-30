import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Button,
    createStyles,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Theme,
    Toolbar,
    Typography,
    useTheme
} from '@material-ui/core';
import { ReactNode, useCallback, useState, VFC } from 'react';
import {
    AccountCircle,
    ArrowDropDownCircle,
    ChevronLeft,
    ChevronRight,
    ExitToApp,
    Home,
    Menu,
    People
} from '@material-ui/icons';
import facultyIcon from '@app/assets/faculty-solid.svg';
import uploadIcon from '@app/assets/cloud-upload.svg';
import boxIcon from '@app/assets/box.svg';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { InlineIcon } from '@app/Components/InlineIcon';
import { useAuth } from '@app/hooks/useAuth';
import { PopoverItem } from '@app/Components/PopoverItem';
import { getUserRole } from '@app/utils/getUserRole';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex'
        },
        appBar: {
            background: '#1976d2',
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            })
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            })
        },
        menuButton: {
            marginRight: 36
        },
        title: {
            flexGrow: 1
        },
        hide: {
            display: 'none'
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap'
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            })
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1
            }
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3)
        }
    })
);
enum PageToNavIndex {
    overview,
    faculties,
    repos,
    upload,
    users
}
export const NavDrawer: VFC<{ children: ReactNode }> = ({ children }) => {
    const classes = useStyles();
    const theme = useTheme();
    const { currentUser, logout } = useAuth();
    const [open, setOpen] = useState(window.innerWidth >= 768);
    const onRefChange = useCallback(async (roleDisplay: HTMLSpanElement | null) => {
        roleDisplay && (roleDisplay.innerText = await getUserRole());
    }, []);

    const currentPath = window.location.pathname;
    const currentPage = currentPath.slice(currentPath.lastIndexOf('/') + 1);
    const [selectedIndex, setSelectedIndex] = useState(PageToNavIndex[currentPage as keyof typeof PageToNavIndex]);
    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);
    const handleListItemClick = (index: number) => () => setSelectedIndex(index);

    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open
                })}
            >
                <Toolbar>
                    <IconButton
                        aria-label="menu"
                        color="inherit"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open
                        })}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        System Console
                    </Typography>
                    <PopoverItem
                        placement="bottom"
                        renderToggle={(toggle, toggleEl) => (
                            <Button ref={toggleEl} onClick={toggle}>
                                <Badge
                                    overlap="circle"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right'
                                    }}
                                    badgeContent={<ArrowDropDownCircle style={{ color: '#FFFFFF' }} />}
                                >
                                    <Avatar
                                        alt={currentUser?.displayName || 'Guest account'}
                                        src={currentUser?.photoURL || ''}
                                    >
                                        <AccountCircle />
                                    </Avatar>
                                </Badge>
                            </Button>
                        )}
                        renderPopContent={() => (
                            <Box display="flex" flexDirection="column" justifyContent="center">
                                <div>{currentUser?.displayName || 'Guest account'}</div>
                                <div>{currentUser?.email}</div>
                                <div>
                                    Global role: <span ref={onRefChange}></span>
                                </div>
                                <Button color="inherit" onClick={logout}>
                                    Logout <ExitToApp />
                                </Button>
                            </Box>
                        )}
                    />
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open
                })}
                //TODO: Understand the 'paper' prop below
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open
                    })
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem
                        selected={selectedIndex === 0}
                        onClick={handleListItemClick(0)}
                        button
                        component={Link}
                        to={`/console/${PageToNavIndex[0]}`}
                    >
                        <ListItemIcon>
                            <Home />
                        </ListItemIcon>
                        <ListItemText primary="Overview" />
                    </ListItem>
                    <ListItem
                        selected={selectedIndex === 1}
                        onClick={handleListItemClick(1)}
                        button
                        component={Link}
                        to={`/console/${PageToNavIndex[1]}`}
                    >
                        <ListItemIcon>
                            <InlineIcon src={facultyIcon} />
                        </ListItemIcon>
                        <ListItemText primary="Faculties" />
                    </ListItem>
                    <ListItem
                        selected={selectedIndex === 2}
                        onClick={handleListItemClick(2)}
                        button
                        component={Link}
                        to={`/console/${PageToNavIndex[2]}`}
                    >
                        <ListItemIcon>
                            <InlineIcon src={boxIcon} />
                        </ListItemIcon>
                        <ListItemText primary="Repos" />
                    </ListItem>
                    <ListItem
                        selected={selectedIndex === 3}
                        onClick={handleListItemClick(3)}
                        button
                        component={Link}
                        to={`/console/${PageToNavIndex[3]}`}
                    >
                        <ListItemIcon>
                            <InlineIcon src={uploadIcon} />
                        </ListItemIcon>
                        <ListItemText primary="Upload files" />
                    </ListItem>
                    <ListItem
                        selected={selectedIndex === 4}
                        onClick={handleListItemClick(4)}
                        button
                        component={Link}
                        to={`/console/${PageToNavIndex[4]}`}
                    >
                        <ListItemIcon>
                            <People />
                        </ListItemIcon>
                        <ListItemText primary="Users & Roles" />
                    </ListItem>
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {children}
            </main>
        </div>
    );
};
