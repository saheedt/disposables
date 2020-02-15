import React, { FC } from 'react';

interface PropType {
    children: any[],
    styleClass: string
}

const Header: FC<PropType> = ({ children, styleClass }) => {
    return (
        <header className={`${styleClass}`}>
            {children}
        </header>
    );
};

export default Header;
