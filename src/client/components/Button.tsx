import React, { FC, MouseEventHandler } from 'react';

interface PropType {
    children: any,
    externalStyle?: string,
    handleClick?: any,
    disabled?: boolean
}

const Button: FC<PropType> = ({ disabled, externalStyle, handleClick, children }) => {
    return (
        <button className={`button ${externalStyle}`} disabled={disabled} onClick={handleClick}>
            {children}
        </button>
    )
};

export default Button;
