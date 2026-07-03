import { createContext, useContext } from 'react';
import { BasicCardType, type CardTypeValue } from '@/constant/sidemenu.constants';

interface CardTypeContextValue {
  cardType: CardTypeValue;
}

export const CardTypeContext = createContext<CardTypeContextValue>({ cardType: BasicCardType });

export const useCardType = () => useContext(CardTypeContext);
