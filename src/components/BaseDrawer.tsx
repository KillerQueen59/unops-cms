import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, Menu, MenuItem, Button } from '@mui/material';
import {
  DownloadIcon,
  FarmIcon,
  PresentationChartIcon,
  PuzzlePieceIcon,
  UsersIcon,
  ChartBarIcon,
} from '@phosphor-icons/react';
import { usePathname } from 'next/navigation';
import { GearIcon, SolarRoofIcon } from '@phosphor-icons/react/dist/ssr';
import { getAuthEmail, getAuthRole, logout } from '@/lib/api';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}));

interface BaseDrawerProps {
  children: React.ReactNode;
}

export default function BaseDrawer({ children }: BaseDrawerProps) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const email = getAuthEmail() || 'User';
  const role = getAuthRole() || 'Role';

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
  };

  const navigationItems = [
    {
      section: 'Data Input',
      items: [
        {
          text: 'Training',
          icon: <PresentationChartIcon size={20} />,
          activeIcon: (
            <PresentationChartIcon
              size={20}
              color={theme.palette.primary.main}
              weight="fill"
            />
          ),
          href: '/training',
        },
        ...(role === 'admin'
          ? []
          : [
              {
                text: 'Village',
                icon: <SolarRoofIcon size={20} />,
                activeIcon: (
                  <SolarRoofIcon
                    size={20}
                    color={theme.palette.primary.main}
                    weight="fill"
                  />
                ),
                href: '/village',
              },
              {
                text: 'Activity',
                icon: <PuzzlePieceIcon size={20} />,
                activeIcon: (
                  <PuzzlePieceIcon
                    size={20}
                    color={theme.palette.primary.main}
                    weight="fill"
                  />
                ),
                href: '/activity',
              },
              {
                text: 'Demosite',
                icon: <FarmIcon size={20} />,
                activeIcon: (
                  <FarmIcon
                    size={20}
                    color={theme.palette.primary.main}
                    weight="fill"
                  />
                ),
                href: '/demosite',
              },
              {
                text: 'Data',
                icon: <DownloadIcon size={20} />,
                activeIcon: (
                  <DownloadIcon
                    size={20}
                    color={theme.palette.primary.main}
                    weight="fill"
                  />
                ),
                href: '/data',
              },
            ]),
      ],
    },
    {
      section: 'Administration',
      items: [
        // Dashboard Website - available to all roles
        {
          text: 'Dashboard Website',
          icon: <ChartBarIcon size={20} />,
          activeIcon: (
            <ChartBarIcon
              size={20}
              color={theme.palette.primary.main}
              weight="fill"
            />
          ),
          href:
            process.env.NEXT_PUBLIC_API_DASHBOARD_URL ||
            'https://simelaproklim.com',
          external: true,
        },
        // Other admin items - restricted to non-admin roles
        ...(role === 'admin'
          ? []
          : [
              {
                text: 'User Management',
                icon: <UsersIcon size={20} />,
                activeIcon: (
                  <UsersIcon
                    size={20}
                    color={theme.palette.primary.main}
                    weight="fill"
                  />
                ),
                href: '/user',
              },
              {
                text: 'Global Config',
                icon: <GearIcon size={20} />,
                activeIcon: (
                  <GearIcon
                    size={20}
                    color={theme.palette.primary.main}
                    weight="fill"
                  />
                ),
                href: '/global-config',
              },
            ]),
      ],
    },
  ];

  React.useEffect(() => {
    const checkIsTabletOrLower = () => {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(max-width: 900px)').matches;
      }
      return false;
    };

    setOpen(!checkIsTabletOrLower());
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        elevation={0}
        sx={{ backgroundColor: 'white', borderBottom: '1px solid #EAEBF0' }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon sx={{ color: theme.palette.primary.main }} />
          </IconButton>
          <Box flexGrow={1} />
          <Box display="flex" alignItems="center">
            <Button
              onClick={handleUserMenuClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                textTransform: 'none',
                color: 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Avatar />
              <Box
                display={'flex'}
                flexDirection="column"
                ml={2}
                color={theme.palette.text.primary}
              >
                <Typography
                  variant="subtitle2"
                  noWrap
                  component="div"
                  gutterBottom={false}
                  sx={{ textAlign: 'left' }}
                >
                  {email}
                </Typography>
                <Typography
                  variant="body2"
                  noWrap
                  component="div"
                  color="text.secondary"
                  sx={{ textAlign: 'left' }}
                >
                  {role}
                </Typography>
              </Box>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon sx={{ color: theme.palette.primary.main }} />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {navigationItems.map((item) => (
            <Box key={item.section}>
              {open && (
                <Typography
                  variant="subtitle1"
                  sx={{
                    padding: 2,
                    color: theme.palette.text.secondary,
                    fontWeight: 300,
                  }}
                >
                  {item.section}
                </Typography>
              )}
              {item.items.map((subItem) => (
                <ListItem
                  key={subItem.text}
                  disablePadding
                  sx={{
                    display: 'block',
                    backgroundColor:
                      !subItem.external && pathname === subItem.href
                        ? theme.palette.primary.light
                        : 'transparent',
                    color:
                      !subItem.external && pathname === subItem.href
                        ? theme.palette.primary.main
                        : theme.palette.grey[400],
                  }}
                >
                  <ListItemButton
                    component="a"
                    href={subItem.href}
                    target={subItem.external ? '_blank' : undefined}
                    rel={subItem.external ? 'noopener noreferrer' : undefined}
                    sx={[
                      {
                        minHeight: 48,
                        px: 2.5,
                      },
                      open
                        ? {
                            justifyContent: 'initial',
                          }
                        : {
                            justifyContent: 'center',
                          },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        {
                          minWidth: 0,
                          justifyContent: 'center',
                        },
                        open
                          ? {
                              mr: 3,
                            }
                          : {
                              mr: 'auto',
                            },
                      ]}
                    >
                      {!subItem.external && pathname === subItem.href
                        ? subItem.activeIcon
                        : subItem.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={subItem.text}
                      sx={[
                        {
                          '& .MuiTypography-root': {
                            fontWeight: 600,
                          },
                        },
                        open
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </Box>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          maxWidth: '100%',
          bgcolor: 'background.default',
          p: 2,
          backgroundColor: '#ECF2F3',
          overflow: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
