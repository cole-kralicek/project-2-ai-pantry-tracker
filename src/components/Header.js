import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';

import Drawer from './Drawer.js';

const Header = () => {

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <Drawer />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AI Pantry Tracker
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;