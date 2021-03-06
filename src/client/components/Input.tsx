import React, { useState, FC, useEffect } from 'react';

import { FormInputAsButton } from '../../constants';

interface PropType {
    placeholder?: string
    clear?: string
    label: string
    type?: string
    disabled?: boolean
    autoComplete?: string
    minLength?: number
    maxLength?: number
    required?: boolean
    extractValue?: Function
}

const Input: FC<PropType> = ({ placeholder, extractValue, clear, label,
    type, autoComplete, required, minLength, maxLength, disabled = false }) => {
    const [value, setValue] = useState('');

    const handleChange = (event: any): void => {
        setValue(event.target.value);
        extractValue(event.target.value);
    };

    useEffect(() => {
        if (type && (type.toLowerCase() == FormInputAsButton.SUBMIT
            || type.toLowerCase() == FormInputAsButton.BUTTON)) {
            setValue(label)
        }
    }, []);

    useEffect(() => {

        if (type) {
            if (type.toLowerCase() !== FormInputAsButton.SUBMIT
                && type.toLowerCase() !== FormInputAsButton.BUTTON) {
                setValue('');
            }
            return;
        }
        setValue('');
    }, [clear]);

    return (
        <input
            name={label}
            placeholder={placeholder}
            aria-label={label}
            value={value}
            onChange={handleChange}
            type={type}
            autoComplete={autoComplete}
            minLength={minLength}
            maxLength={maxLength}
            required={required}
            disabled={disabled}
        />
    )
};

export default Input;
