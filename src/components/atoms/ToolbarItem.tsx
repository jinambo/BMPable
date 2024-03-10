interface ToolbarItemProps {
  title: string;
  Icon: any;
  action: () => void;
}

const ToolbarItem = ({ title, Icon, action }: ToolbarItemProps) => {
  return (
    <li className='toolbar-item' onClick={action}>
      <Icon className='small-icon' />
      {title}
    </li>
  );
}

export default ToolbarItem;
