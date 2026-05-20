import { createContext, useContext } from 'react';

interface CardTypeContextValue {
  cardType: string;
}

export const CardTypeContext = createContext<CardTypeContextValue>({ cardType: 'basic' });

export const useCardType = () => useContext(CardTypeContext);
