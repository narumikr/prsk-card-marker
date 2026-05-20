import { SekaiBackground } from '@naru/untitled-ui-library';
import { useState } from 'react';
import { SideMenu } from '@/components/organisms/SideMenu';
import { CardTypeContext } from '@/context/CardTypeContext';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontFamily, setFontFamily] = useState<string>('');
  const [cardType, setCardType] = useState<string>('basic');

  return (
    <CardTypeContext.Provider value={{ cardType }}>
      <SekaiBackground bgOpacity={0.5} />
      <SideMenu
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        onFontChange={setFontFamily}
        onCardTypeChange={setCardType}
      />
      <div
        style={fontFamily ? ({ '--content-font': fontFamily } as React.CSSProperties) : undefined}
        className={`${fontFamily ? 'content-font-apply' : ''} transition-[margin-left,width] duration-300 ease-out ${isOpen ? 'ml-62.5 w-[calc(100vw-250px)]' : 'ml-15 w-[calc(100vw-60px)]'}`}>
        {children}
      </div>
    </CardTypeContext.Provider>
  );
};
