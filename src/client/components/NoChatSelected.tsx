import React, { FC, useState, useEffect, useContext } from 'react';

interface PropType {
  noChatSelectedMessage: string
}

const NoChatSelected: FC<PropType> = ({ noChatSelectedMessage }) => (
  <div className="non-selected">
    <h1>{noChatSelectedMessage}</h1>
  </div>
);

export default NoChatSelected;