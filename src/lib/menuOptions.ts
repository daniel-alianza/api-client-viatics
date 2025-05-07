export const menuOptions = [
  { id: 'option1', label: 'Option 1', color: '#F34602', icon: null },
  { id: 'option2', label: 'Option 2', color: '#02082C', icon: null },
  { id: 'option3', label: 'Option 3', color: '#F34602', icon: null },
];

export const subMenuOptions: Record<string, { id: string; label: string }[]> = {
  option1: [
    { id: 'sub1', label: 'Sub Option 1' },
    { id: 'sub2', label: 'Sub Option 2' },
  ],
  option2: [
    { id: 'sub3', label: 'Sub Option 3' },
    { id: 'sub4', label: 'Sub Option 4' },
  ],
  option3: [
    { id: 'sub5', label: 'Sub Option 5' },
    { id: 'sub6', label: 'Sub Option 6' },
  ],
};
