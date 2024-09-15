import React from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    List,
    ListItem,
    Typography,
    styled,
    ListItemButton,
    ListItemText,
} from '@mui/material';
// menu
import DrawerItem from './DrawerItem';
// rotas
import { Link, useLocation } from 'react-router-dom';
import logo from '../../img/logo.png';
// personalizacao
const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
});

const ListMenu = styled(List)(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.up("sm")]: {
        display: "flex",
    },
}));

//rotas
const itemList = [
    {
        text: "Home",
        to: "/"
    },
    {
        text: "Patient",
        to: "/patientsignup"
    },
    {
        text: "Doctor",
        to: "/doctorsignup"
    }
];

const Navbar = () => {
    const location = useLocation();
    
    const showNavbarRoutes = ['/','/patientsignup','/doctorsignup','/patientlogin','/doctorlogin']; // Add the routes where you want the Navbar to appear
    
    if (!showNavbarRoutes.includes(location.pathname)) {
        return null;
    }

    return (
        <AppBar
            component="nav"
            position="sticky"
            sx={{
                backgroundColor: 'powderblue',
            }}
            elevation={0}
        >
            <StyledToolbar>
                {/* Logo Container */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                        src={logo} 
                        alt="MedMinion Logo" 
                        style={{
                            borderRadius:'100%',
                            width: '3.5rem',  
                            height: '3.5rem', 
                            marginRight: '10px', 
                            border: '2px solid #ddd',
                        }}
                    />
                <Typography
                    variant="h5"
                    component="h2"
                    color={'black'}
                >
                    MedMinion
                </Typography>
                </Box>
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                    <DrawerItem />
                </Box>
                <ListMenu>
                    {itemList.map((item) => {
                        const { text } = item;
                        return (
                            <ListItem key={text}>
                                <ListItemButton component={Link} to={item.to}
                                    sx={{
                                        color: 'black',
                                        
                                        "&:hover": {
                                            backgroundColor: 'transparent',
                                            color: 'orange',
                                        }
                                    }}
                                >
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </ListMenu>
            </StyledToolbar>
        </AppBar>
    )
}

export default Navbar;
