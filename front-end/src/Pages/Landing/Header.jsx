import React from 'react'
import { Box, styled, Typography } from "@mui/material";
import { Link } from 'react-router-dom'

import headerImg from '../../img/bg_img.jpg';

const Header = () => {

    const CustomBox = styled(Box) (({ theme }) => ({
        minHeight: '69vh',
        display: 'flex',
        justifyContent: 'center',
        gap: theme.spacing(2),
        paddingTop: theme.spacing(10),
        backgroundColor: 'orange',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
        }
    }));

    const BoxText = styled(Box) (({ theme }) => ({
        flex: '1',
        paddingLeft: theme.spacing(8),
        [theme.breakpoints.down('md')]: {
            flex: '2',
            textAlign: 'center',
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    }));

    return (
        <CustomBox component='header'>
            {/*  Box text  */}
            <BoxText 
            component='section'
            >
                <Typography
                variant='h2'
                component= 'h1'
                sx={{
                    fontWeight: 700,
                    color: '#fff',
                    textAlign: 'center',
                    fontFamily: 'revert',
                    marginRight:4
                }}
                >
                Welcome to MedMinion
                </Typography>

                <Typography
                variant='p'
                component='p'
                sx={{
                    py: 3,
                    color: '#fff',
                    fontWeight: 500,
                    color: '#fff',
                    textAlign: 'center',
                    fontFamily: 'revert',
                    marginRight:4,
                    fontSize:18
                }}
                >
                    Here, we automate your clinic’s manual tasks for seamless healthcare management!
                </Typography>


            </BoxText>

            <Box sx={theme => ({
                [theme.breakpoints.down('md')]: {
                    flex: '1',
                    paddingTop: '30px',
                    alignSelf: 'center',
                },
                [theme.breakpoints.up('md')]: {
                    flex: '2',
                    alignSelf: 'flex-start', // Changed from 'flex-end' to 'flex-start'
                    marginTop: '-400px', // Adjust the value as needed
                },
            })}
            >
                <img
                src={headerImg}
                alt="headerImg"
                style={{ 
                    width: "100%",
                    height:'100%',
                    marginBottom: 0,
                    overflow:'hidden'
                }}
                />
            </Box>

        </CustomBox>
    )
}

export default Header;
