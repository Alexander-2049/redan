import { Minus, Maximize, X } from "@mynaui/icons-react";

const TitleBar = () => {
  const buttonClassName =
    "flex h-full w-12 items-center justify-center hover:cursor-default transition-colors duration-200";
  const buttonHoverEffect = "hover:bg-slate-300";
  const closeButtonHoverEffect = "hover:bg-red-500";

  return (
    <div className="drag flex h-9 w-full flex-row justify-between bg-slate-200">
      <div className="grow"></div>
      <div className="flex h-full flex-row">
        <button className={[buttonClassName, buttonHoverEffect].join(" ")}>
          <Minus width={16} />
        </button>
        <button className={[buttonClassName, buttonHoverEffect].join(" ")}>
          <Maximize width={16} />
        </button>
        <button className={[buttonClassName, closeButtonHoverEffect].join(" ")}>
          <X width={16} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
