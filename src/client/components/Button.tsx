import React, { FC, MouseEventHandler } from 'react';

interface PropType {
    text: string,
    externalStyle?: string,
    handleClick?: any,
}

const Button: FC<PropType> = ({ text, externalStyle, handleClick}) => {
    return (
        <button className={`button ${externalStyle}`} onClick={handleClick}>
            {text}
        </button>
    )
};

export default Button;
