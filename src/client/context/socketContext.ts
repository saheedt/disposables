import React, { createContext } from 'react';
import { SocketService } from '../services/socketService';

export const SocketContext: React.Context<SocketService> = createContext(new SocketService());