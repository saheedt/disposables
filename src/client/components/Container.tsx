import React, { FC, ReactChildren } from 'react';

const Container: FC<{children: ReactChildren}> = ({ children }) => {
    return (
        <main className="container">{children}</main>
    )
};
export default Container;