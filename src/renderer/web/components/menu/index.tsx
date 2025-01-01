import './menu.css';

const Menu = () => {
  return (
    <div className='menu__wrapper'>
      <button className='menu__button'>Dashboard</button>
      <button className='menu__button'>Overlays</button>
      <button className='menu__button'>Layouts</button>
    </div>
  );
};

export default Menu;