import { SideMenu as SekaiSideMenu } from '@naru/untitled-ui-library';
import { Dropdown } from '@/components/molecules/Dropdown';

interface SideMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

export const SideMenu = ({ isOpen, onClick }: SideMenuProps) => {
  return (
    <SekaiSideMenu open={isOpen} onClick={onClick}>
      <Dropdown
        title="Menu"
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ]}
      />
    </SekaiSideMenu>
  );
};
