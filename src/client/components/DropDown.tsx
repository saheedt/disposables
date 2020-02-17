import React, { useEffect } from 'react';

import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const DropDown = ({ icon, children }: any) => {
    console.log('obvious render/re-render');
    useEffect(() => {
        console.log('one time render?');
    }, []);
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
