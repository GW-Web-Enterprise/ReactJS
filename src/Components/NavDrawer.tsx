import {
    AppBar,
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
import React, { ReactNode, useState, VFC } from 'react';
import { ChevronLeft, ChevronRight, Home, Menu, People } from '@material-ui/icons';
import facultyIcon from '@app/assets/faculty-solid.svg';
import articleIcon from '@app/assets/article.svg';
import keyIcon from '@app/assets/key.svg';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { InlineIcon } from '@app/Components/InlineIcon';
import { useAuth } from '@app/Contexts/AuthContext';

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

export const NavDrawer: VFC<{ children: ReactNode }> = ({ children }) => {
    const classes = useStyles();
    const theme = useTheme();
    const { logout } = useAuth();
    const [open, setOpen] = useState(window.innerWidth >= 768);
    enum PageToNavIndex {
        overview,
        faculties,
        articles,
        users,
        roles
    }
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
                    <Button color="inherit" onClick={logout}>
                        Logout
                    </Button>
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
                            <InlineIcon src={articleIcon} />
                        </ListItemIcon>
                        <ListItemText primary="Articles" />
                    </ListItem>
                    <ListItem
                        selected={selectedIndex === 3}
                        onClick={handleListItemClick(3)}
                        button
                        component={Link}
                        to={`/console/${PageToNavIndex[3]}`}
                    >
                        <ListItemIcon>
                            <People />
                        </ListItemIcon>
                        <ListItemText primary="Users" />
                    </ListItem>
                    <ListItem
                        selected={selectedIndex === 4}
                        onClick={handleListItemClick(4)}
                        button
                        component={Link}
                        to={`/console/${PageToNavIndex[4]}`}
                    >
                        <ListItemIcon>
                            <InlineIcon src={keyIcon} />
                        </ListItemIcon>
                        <ListItemText primary="Roles & Permissions" />
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
