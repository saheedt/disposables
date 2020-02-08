import React, { useState } from 'react';

import { InputProps } from '../types';
import { FormInputAsButton } from '../../constants';

const Input = ({ placeholder, extractValue, label, type, disabled=false }: InputProps) => {
    const [value, setValue] = useState('');

    const handleChange = (event: any): void => {
        setValue(event.target.value);
        extractValue(event.target.value);
    };

    if (type && (type.toLowerCase() == FormInputAsButton.SUBMIT
        || type.toLowerCase() == FormInputAsButton.BUTTON)) {
        setValue(label)
    }
    return (
        <input
            name={label}
            placeholder={placeholder}
            aria-label={label}
            value={value}
            onChange={handleChange}
            type={type}
            disabled={disabled}
        />
    )
};

export default Input;
