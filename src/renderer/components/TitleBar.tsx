import { Minus, X, Square, Home } from "@mynaui/icons-react";
import { Link } from "react-router-dom";

const TitleBar = () => {
  const buttonClassName =
    "flex h-full w-12 items-center justify-center hover:cursor-default transition-colors duration-200";
  const buttonHoverEffect = "hover:bg-slate-300";
  const closeButtonHoverEffect = "hover:bg-red-500";
  const iconSize = 16;

  return (
    <div className="drag flex h-9 w-full shrink-0 flex-row justify-between bg-slate-200">
      <div className="grow">
        <Link
          to="/"
          className={[buttonClassName, buttonHoverEffect]
            .join(" ")
            .replace("w-12", "w-9")}
        >
          <Home width={iconSize} />
        </Link>
      </div>
      <div className="flex h-full flex-row">
        <button
          className={[buttonClassName, buttonHoverEffect].join(" ")}
          onClick={() => {
            window.actions.minimize();
          }}
        >
          <Minus width={iconSize} />
        </button>
        <button
          className={[buttonClassName, buttonHoverEffect].join(" ")}
          onClick={() => {
            window.actions.restore();
          }}
        >
          <Square width={iconSize / 1.3} />
        </button>
        <button
          className={[buttonClassName, closeButtonHoverEffect].join(" ")}
          onClick={() => {
            window.actions.close();
          }}
        >
          <X width={iconSize} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
