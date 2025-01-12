import { PageType } from "../../types/PageType";
import "./menu.css";

const Menu = ({
  setSelectedPage,
}: {
  setSelectedPage: (page: PageType) => void;
}) => {
  return (
    <div className="menu__wrapper">
      <button
        className="menu__button"
        onClick={() => {
          setSelectedPage("dashboard");
        }}
      >
        Dashboard
      </button>
      <button
        className="menu__button"
        onClick={() => {
          setSelectedPage("overlays");
        }}
      >
        Overlays
      </button>
      <button
        className="menu__button"
        onClick={() => {
          setSelectedPage("layouts");
        }}
      >
        Layouts
      </button>
    </div>
  );
};

export default Menu;
