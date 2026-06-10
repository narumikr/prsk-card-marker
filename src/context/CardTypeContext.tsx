import { createContext, useContext } from 'react';
import type { CardTypeValue } from '@/constant/sidemenu.constants';

interface CardTypeContextValue {
  cardType: CardTypeValue;
}

export const CardTypeContext = createContext<CardTypeContextValue>({ cardType: 'basic' });

export const useCardType = () => useContext(CardTypeContext);
