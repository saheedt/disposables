import React, { FC, MouseEventHandler } from 'react';

interface PropType {
    text: string,
    externalStyle?: string,
    handleClick?: any,
    disabled?: boolean
}

const Button: FC<PropType> = ({ disabled, externalStyle, handleClick, text }) => {
    return (
        <button className={`button ${externalStyle}`} disabled={disabled} onClick={handleClick}>
            {text}
        </button>
    )
};

export default Button;
