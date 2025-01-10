import React from 'react';

type IconSwapProps = {
  className?: string;
  onClick?: () => void;
};

const IconSwap: React.FC<IconSwapProps> = ({ className, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
      <svg
        aria-hidden="true"
        focusable="false"
        role="none"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          fillRule="evenodd"
          d="m16.629 11.999-1.2-1.2 3.085-3.086H2.572V5.999h15.942L15.43 2.913l1.2-1.2 4.543 4.543a.829.829 0 0 1 0 1.2l-4.543 4.543Zm-9.257-.001 1.2 1.2-3.086 3.086h15.943v1.714H5.486l3.086 3.086-1.2 1.2-4.543-4.543a.829.829 0 0 1 0-1.2l4.543-4.543Z"
          clipRule="evenodd"
        ></path>
      </svg>
    </div>
  );
};

export default IconSwap;
