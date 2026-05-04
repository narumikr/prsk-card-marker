import { type ColorsSekaiKey, SideMenu as SekaiSideMenu, useCreateSekai } from '@naru/untitled-ui-library';
import { Dropdown } from '@/components/molecules/Dropdown';
import { SideMenuText } from '@/constant/components.constant';
import { OshiDropdownItem } from '@/constant/sidemenu.constants';

interface SideMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

export const SideMenu = ({ isOpen, onClick }: SideMenuProps) => {
  const { switchSekaiColor } = useCreateSekai();

  const handleSwitchSekai = (value: string) => {
    switchSekaiColor?.(value as ColorsSekaiKey);
  };

  return (
    <SekaiSideMenu open={isOpen} onClick={onClick}>
      <Dropdown title={SideMenuText.sekaiTheme} options={OshiDropdownItem} onSelect={handleSwitchSekai} />
    </SekaiSideMenu>
  );
};
