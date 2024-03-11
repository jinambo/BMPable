import { ReactNode, useState } from "react";
import Down from "../../assets/icons/down.svg";

interface ToolbarItemProps {
  title: string;
  Icon: any;
  action?: () => void;
  children?: ReactNode;
}

const ToolbarItem = ({ title, Icon, action, children }: ToolbarItemProps) => {
  const DownIcon: any = Down;
  const [toggleItem, setToggleItem] = useState<Boolean>(false);

  return (
    <li
      className='toolbar-item'
      onClick={action}
    >
      <div
        className={`toolbar-item__inner bg-primary ${ toggleItem && 'active' }`}
        onClick={() => children && setToggleItem(!toggleItem)}
      >
        <div className="flex-middle">
          <Icon className='small-icon' />
          {title}
        </div>
        { children &&
          <DownIcon className={`small-icon small-icon--stroke ${toggleItem && 'small-icon--flipped'}`}
        />}
      </div>

      { toggleItem && 
        <div className="toolbar-item__content">
          <div className="inner">
            {children}
          </div>
        </div>
      }
    </li>
  );
}

export default ToolbarItem;
