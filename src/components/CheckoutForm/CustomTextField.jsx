import React from 'react';
import { TextField, Grid } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';


const FormInput = ({ name, label}) => {
    const { control, register } = useFormContext();
    const isError = false;

    return (
        <Grid item xs={12} sm={6}>

            <Controller
                render={({ field }) => <TextField {...field } label={label} required={true} defaultValue="" />}
                name={name}
                control={control}
                fullWidth={true}
            />
        </Grid>

    );
}

export default FormInput;
