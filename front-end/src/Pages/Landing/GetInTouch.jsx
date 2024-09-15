import React from 'react'
import {  
    Button,
    Stack,
} from '@mui/material'
import Title from './Title'
import Paragraph from './Paragraph'
import { Link } from 'react-router-dom'

const GetInTouch = () => {

    return (
        <Stack 
        component='section'
        direction="column"
        justifyContent= 'center'
        alignItems='center'
        sx={{
            py: 10,
            mx: 0,
            backgroundColor:'orange'
        }}
        >
            <Title 
            text={
                'CONTACT US TO KNOW MORE'
                } 
            textAlign={'center'}
            />
            <Paragraph 
            text={
                <>
                    Rishav Sachdeva: sachdevarishav449@gmail.com <br />
                    Sushweta Bhattacharya: sushwetabm@gmail.com <br />
                    Hansawani Saini: hansawani07@gmail.com
                </>
            }
            maxWidth = {'sm'}
            mx={0}
            textAlign={'center'}    
            />
            <Paragraph
            text={'© MedMinion. All Rights Reserved.'}
            maxWidth = {'sm'}
            mx={0}
            textAlign={'center'} 
            />
        </Stack>
    )
}

export default GetInTouch;