import React from 'react'
import { 
    Box,
    Grid,
    styled,
    Typography,
    keyframes
} from '@mui/material'
import Title from './Title'
// img
import imgDetail from '../../img/img.png';
import imgDetail2 from '../../img/img2.png';

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const GetStarted = () => {

    const CustomGridItem = styled(Grid) ({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    })
    
    const CustomTypography = styled(Typography) ({
        fontSize: '1.1rem',
        textAlign: 'start',
        lineHeight: '1.5',
        color: '#515151',
        marginTop: '1.5rem',
        animation: `${fadeIn} 1.2s ease-in-out`,
    })
    const animatedTitleSx = {
        fontWeight: 700,
        fontSize: '2rem',
        color: '#000',
        animation: `${fadeIn} 1.5s ease-in-out`,
    };

    return (
            
        <Grid container spacing={{ xs: 4, sm: 4, md: 0 }}   
        sx={{
            py: 0.5,
            px: 1,
             
        }}
        >
            <CustomGridItem item xs={12} sm={8} md={6} 
            component = 'section'
           
            >
                <Box component='article'
                sx={{
                    px: 4,
                    animation: '${fadeIn} 1s ease-in-out'
                }}
                >
                    <Title
                    text={'MedMinion for Patients'}
                    textAlign={'start'}
                    sx={animatedTitleSx}
                    />
                    <CustomTypography>
                    We help you manage your healthcare effortlessly by providing:<br></br>
                    1. Easy appointment booking, rescheduling, and cancellation.<br></br>
                    2. A personalized dashboard displaying all your appointment details.<br></br>
                    3. Access to your medical test results, if available.<br></br>
                    4. A simple, user-friendly interface for managing your healthcare needs.<br></br>
                    5. A streamlined experience that saves time and reduces hassle.  
                    </CustomTypography> 
                </Box>

            </CustomGridItem>
            
            <Grid item xs={12} sm={4} md={6}>
                <img src={imgDetail} alt="" 
                style={{
                    marginTop:0,
                    width: '100%',
                    animation: '${fadeIn} 1.5s ease-in-out'
                }}
                />
            </Grid>

            <Grid item xs={12} sm={4} md={6}
            sx={{
                order: {xs: 4, sm: 4, md: 3},
                animation: '${fadeIn} 1.5s ease-in-out'
            }}
            >
                <img src={imgDetail2} alt="" 
                style={{ 
                    width: "100%",
                    marginTop:0
                }}
                />
            </Grid>

            <CustomGridItem item xs={12} sm={8} md={6}
            sx={{
                order: {xs: 3, sm: 3, md: 4},
                animation: '${fadeIn} 1.5s ease-in-out'
            }}
            >
                <Box component='article'
                sx={{
                    py:2,
                    px: 4,
                    animation:'${fadeIn} 1.2s ease-in-out'
                }}
                >
                    <Title
                    text={
                        'MedMinion for Doctors'
                        
                    }
                    textAlign={'start'}
                    sx={animatedTitleSx} 
                    />
                    <CustomTypography>
                    Our platform offers a comprehensive solution that allows you to:<br></br>
                    1. View and organize your appointments in real-time.<br></br>
                    2. Automate prescription management, so you don’t have to write the same medications for different patients repeatedly.<br></br>
                    3. Upload and organize patients' test results effortlessly, ensuring their records are up-to-date.<br></br> 
                        
                    </CustomTypography>
                </Box>
            </CustomGridItem>
        </Grid>
    )
}

export default GetStarted;