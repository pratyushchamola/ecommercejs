import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core';

import { commerce } from '../../../lib/commerce';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { Link , useHistory} from 'react-router-dom';

const steps = ['Shipping address', 'Payment details'];

const Checkout = ({ cart, order, onCaptureCheckout, error, refreshCart }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        const generateToken = async () => {
            try {
                const  token  = await commerce.checkout.generateToken(cart.id, { type: 'cart'})

                // console.log(token);

                setCheckoutToken(token);

            } catch (error) {
                // console.log(error)
                console.log(error);
                // history.push('/');
                // history.push({
                //     pathname:  "/",
                //     state: {
                //       response: messageFromServer 
                //     } 
                //  });
            }
        }

        generateToken();
    },[cart]);

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

    const next = (data) => {
        setShippingData(data);

        console.log(data);
        nextStep();
    }

    // 3: 23 : 12
    const timeout = () => {
        setTimeout(()=> {
           setIsFinished(true);
        },3000)
    }

    // const handleClick = () => {
    //     refreshCart();
    //     history.pushState('/');
    // }

    let Confirmation = () => order.customer ?  (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
                <Divider className={classes.divider} />
                <Typography variant="subtitle">Order ref: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
            {/* <Button onClick={handleClick}>Back to Home</Button> */}

        </>
    ) : isFinished ? (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase</Typography>
                <Divider className={classes.divider} />
            </div>
            <br />
            {/* {refreshCart()} */}
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
            {/* <Button onClick={handleClick}>Back to Home</Button> */}

        </>

    ) : (

        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

    if(error){
        <>
            <Typography variant="h5">Error: {error}</Typography>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    }

    const Form = () => activeStep === 0
        ? <AddressForm checkoutToken={checkoutToken} next={next} />
        : <PaymentForm  refreshCart={refreshCart} shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} timeout={timeout} /> ;

    return (
        <>
        <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel> 
                                {/* 1: 45 : 40 */}
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form /> }
                    {/* {activeStep === steps.length ? <Confirmation /> : <Form /> } */}
                </Paper>
            </main>
        </>
    )
}

export default Checkout
