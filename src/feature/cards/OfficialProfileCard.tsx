import type { Ref } from 'react';
import officialProfile from '@/assets/official-profile.jpg';
import { CoordInput } from '@/components/molecules/CoordInput';
import { CoordTextArea } from '@/components/molecules/CoordTextArea';
import { OFFICIAL_CARD_HEIGHT, OFFICIAL_CARD_WIDTH, OfficialProfileCardInputLabels } from '@/constant/cards.constant';
import { useCardScale } from '@/hooks/useCardScale';
import { useSekaiColor } from '@/hooks/useSekaiColor';

interface OfficialProfileCardProps {
  ref?: Ref<HTMLDivElement>;
}

export const OfficialProfileCard = ({ ref }: OfficialProfileCardProps) => {
  const { text } = useSekaiColor();
  const { wrapperRef, scale } = useCardScale(OFFICIAL_CARD_WIDTH);

  return (
    <div ref={wrapperRef} className="w-full" style={{ maxWidth: OFFICIAL_CARD_WIDTH, height: OFFICIAL_CARD_HEIGHT * scale }}>
      <div
        data-card-content="true"
        ref={ref}
        style={{
          width: OFFICIAL_CARD_WIDTH,
          height: OFFICIAL_CARD_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'relative',
        }}>
        <img
          src={officialProfile}
          alt="公式プロフィールカード"
          style={{ width: OFFICIAL_CARD_WIDTH, height: OFFICIAL_CARD_HEIGHT, objectFit: 'cover' }}
        />
        {/* MY PROFILE */}
        <CoordInput x={180} y={97} w={133} h={28} label={OfficialProfileCardInputLabels.name} className={text} />
        <CoordInput x={391} y={97} w={30} h={28} label={OfficialProfileCardInputLabels.birthdayMonth} className={text} />
        <CoordInput x={441} y={97} w={30} h={28} label={OfficialProfileCardInputLabels.birthdayDay} className={text} />
        <CoordInput x={146} y={134} w={195} h={28} label={OfficialProfileCardInputLabels.personality} className={text} />
        <CoordInput x={146} y={169} w={195} h={28} label={OfficialProfileCardInputLabels.specialSkill} className={text} />
        <CoordInput x={146} y={204} w={195} h={28} label={OfficialProfileCardInputLabels.actualy} className={text} />
        <CoordInput x={146} y={239} w={195} h={28} label={OfficialProfileCardInputLabels.hobby} className={text} />
        {/* MY FAVORITES */}
        <CoordInput x={92} y={333} w={146} h={34} label={OfficialProfileCardInputLabels.food} className={text} />
        <CoordInput x={247} y={333} w={146} h={34} label={OfficialProfileCardInputLabels.drink} className={text} />
        <CoordInput x={403} y={333} w={146} h={34} label={OfficialProfileCardInputLabels.season} className={text} />
        <CoordInput x={92} y={392} w={146} h={32} label={OfficialProfileCardInputLabels.animal} className={text} />
        <CoordInput x={247} y={392} w={146} h={32} label={OfficialProfileCardInputLabels.place} className={text} />
        <CoordInput x={403} y={392} w={146} h={32} label={OfficialProfileCardInputLabels.goods} className={text} />
        {/* 連想する人を書いてね! */}
        <CoordInput x={92} y={482} w={146} h={37} label={OfficialProfileCardInputLabels.cool} className={text} />
        <CoordInput x={247} y={482} w={146} h={37} label={OfficialProfileCardInputLabels.kind} className={text} />
        <CoordInput x={403} y={482} w={146} h={37} label={OfficialProfileCardInputLabels.funny} className={text} />
        <CoordInput x={172} y={538} w={146} h={37} label={OfficialProfileCardInputLabels.swapBody} className={text} />
        <CoordInput
          x={328}
          y={538}
          w={146}
          h={37}
          label={OfficialProfileCardInputLabels.withUninhabitedIsland}
          className={text}
        />
        <CoordInput x={247} y={598} w={146} h={32} label={OfficialProfileCardInputLabels.withKaraoke} className={text} />
        {/* FREE SPACE */}
        <CoordTextArea
          x={240}
          y={685}
          w={335}
          h={80}
          label={OfficialProfileCardInputLabels.freeSpace}
          className={`${text} p-1`}
        />
      </div>
    </div>
  );
};
