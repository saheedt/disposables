import React from 'react';

import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';


const DropDown = ({ icon, children }: any) => {

    return (
        <div>
            <Dropdown removeElement={true}>
                <DropdownTrigger>
                    {icon}
                </DropdownTrigger>
                <DropdownContent>
                    {children}
                </DropdownContent>
            </Dropdown>
        </div>
    );
 };

export default DropDown;
