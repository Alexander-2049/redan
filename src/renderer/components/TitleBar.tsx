import { Minus, X, Square } from "@mynaui/icons-react";

const TitleBar = () => {
  const buttonClassName =
    "flex h-full w-12 items-center justify-center hover:cursor-default transition-colors duration-200";
  const buttonHoverEffect = "hover:bg-slate-300";
  const closeButtonHoverEffect = "hover:bg-red-500";
  const iconSize = 16;

  return (
    <div className="drag flex h-9 w-full flex-row justify-between bg-slate-200">
      <div className="grow"></div>
      <div className="flex h-full flex-row">
        <button
          className={[buttonClassName, buttonHoverEffect].join(" ")}
          onClick={() => {
            window.titleBar.sendMessage("minimize");
          }}
        >
          <Minus width={iconSize} />
        </button>
        <button
          className={[buttonClassName, buttonHoverEffect].join(" ")}
          onClick={() => {
            window.titleBar.sendMessage("restore");
          }}
        >
          <Square width={iconSize / 1.3} />
        </button>
        <button
          className={[buttonClassName, closeButtonHoverEffect].join(" ")}
          onClick={() => {
            window.titleBar.sendMessage("close");
          }}
        >
          <X width={iconSize} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
