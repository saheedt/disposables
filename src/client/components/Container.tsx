import React, { FC } from 'react';

interface PropType {
    children: any
}

const Container: FC<PropType> = ({ children }) => {
    return (
        <main className="container">{children}</main>
    )
};
export default Container;