import { BasicButton } from '@naru/untitled-ui-library';
import { useRef } from 'react';
import { CARD_HEIGHT, CARD_WIDTH, OFFICIAL_CARD_HEIGHT, OFFICIAL_CARD_WIDTH } from '@/constant/cards.constant';
import { TOP_PAGE_TEXT } from '@/constant/pages.constant';
import { BasicCardType, LookAtMyOshiCardType, OfficialProfileCardType } from '@/constant/sidemenu.constants';
import { useCardType } from '@/context/CardTypeContext';
import { BasicIntroductionCard } from '@/feature/cards/BasicIntroductionCard';
import { LookAtMyOshiCard } from '@/feature/cards/LookAtMyOshiCard';
import { OfficialProfileCard } from '@/feature/cards/OfficialProfileCard';
import { useCardExport } from '@/hooks/useCardExport';

export function Top() {
  const profileRef = useRef<HTMLDivElement>(null);
  const { cardType } = useCardType();
  const isOfficial = cardType === OfficialProfileCardType;

  const { status, errorMessage, exportImage } = useCardExport({
    targetRef: profileRef,
    width: isOfficial ? OFFICIAL_CARD_WIDTH : CARD_WIDTH,
    height: isOfficial ? OFFICIAL_CARD_HEIGHT : CARD_HEIGHT,
    fileName: TOP_PAGE_TEXT.profileFileName,
  });

  const isBusy = status === 'preparing' || status === 'rendering';
  const buttonLabel =
    status === 'success'
      ? TOP_PAGE_TEXT.exportSuccessLabel
      : isBusy
        ? TOP_PAGE_TEXT.exportingLabel
        : TOP_PAGE_TEXT.saveImageButtonLabel;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 py-8">
      {cardType === BasicCardType && <BasicIntroductionCard ref={profileRef} />}
      {cardType === LookAtMyOshiCardType && <LookAtMyOshiCard ref={profileRef} />}
      {cardType === OfficialProfileCardType && <OfficialProfileCard ref={profileRef} />}
      <BasicButton type="button" onClick={exportImage} disabled={isBusy} aria-busy={isBusy} className="--content-font">
        {buttonLabel}
      </BasicButton>
      {status === 'error' && errorMessage && (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </main>
  );
}
