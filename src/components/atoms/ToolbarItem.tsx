interface ToolbarItemProps {
  title: string;
  img: string;
  action: () => void;
}

const ToolbarItem = ({ title, img, action }: ToolbarItemProps) => {
  return (
    <li className='toolbar-item' onClick={action}>
      <img className='small-icon' src={img} />
      {title}
    </li>
  );
}

export default ToolbarItem;
