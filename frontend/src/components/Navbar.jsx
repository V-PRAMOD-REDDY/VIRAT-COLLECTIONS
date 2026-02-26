import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { 
  HiOutlineUser, HiOutlineShoppingBag, HiOutlineSearch, 
  HiOutlineHome, HiOutlineViewGrid, HiOutlineTruck 
} from 'react-icons/hi';

const Navbar = () => {
  const navigate = useNavigate();
  const { getCartCount, token, setToken, search, setSearch } = useContext(ShopContext);

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate('/shop');
    }
  };

  return (
    <div className='relative'>
      <nav className='sticky top-0 z-50 bg-white border-b shadow-sm'>
        <div className='flex items-center justify-between py-4 px-4 md:px-10 max-w-[1440px] mx-auto gap-4'>
          
          <Link to='/' className='flex flex-col leading-none'>
            <h1 className='text-2xl md:text-4xl font-black uppercase tracking-tighter text-black'>
              VIRAT<span className='text-blue-600'>.</span>
            </h1>
            <p className='text-[8px] md:text-xs font-bold tracking-[0.3em] text-gray-400 uppercase ml-1'>
              Collections
            </p>
          </Link>
          
          {/* Desktop Menu */}
          <ul className='hidden md:flex gap-10 text-[13px] text-black uppercase font-bold tracking-widest items-center'>
            <NavLink to='/' className='hover:text-blue-600 transition-all'>Home</NavLink>
            <NavLink to='/shop' className='hover:text-blue-600 transition-all'>Shop</NavLink>
            <NavLink to='/about' className='hover:text-blue-600 transition-all'>About</NavLink>
          </ul>

          {/* Desktop Search */}
          <div className='hidden md:flex flex-1 max-w-sm items-center bg-gray-100 px-4 py-2 rounded-2xl'>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className='bg-transparent outline-none text-sm w-full font-medium' 
              type="text" 
              placeholder='Search products...' 
            />
            <HiOutlineSearch onClick={() => navigate('/shop')} className='text-xl text-gray-400 cursor-pointer' />
          </div>

          <div className='flex items-center gap-5'>
            {/* Desktop User Profile Dropdown */}
            <div className='group relative hidden md:block'>
              <HiOutlineUser onClick={() => !token && navigate('/login')} className='text-2xl cursor-pointer hover:text-blue-600' />
              {token && (
                <div className='group-hover:block hidden absolute right-0 pt-4 w-44 z-50'>
                  <div className='flex flex-col gap-2 p-4 bg-white shadow-2xl border rounded-xl text-sm font-bold'>
                    <p onClick={() => navigate('/profile')} className='cursor-pointer hover:text-blue-600'>Profile</p>
                    <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-blue-600'>Orders</p>
                    <hr />
                    <p onClick={logout} className='cursor-pointer text-red-500'>Logout</p>
                  </div>
                </div>
              )}
            </div>

            <Link to='/cart' className='relative'>
              <HiOutlineShoppingBag className='text-2xl' />
              <span className='absolute -right-2 -top-1 w-4 h-4 bg-black text-white rounded-full text-[9px] flex items-center justify-center font-bold'>
                {getCartCount()}
              </span>
            </Link>
          </div>
        </div>
        
        {/* Mobile Search Box */}
        <div className='md:hidden px-4 pb-4'>
            <div className='flex items-center bg-gray-100 px-4 py-2 rounded-xl'>
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                onKeyDown={handleSearch}
                className='bg-transparent outline-none text-sm w-full' 
                type="text" 
                placeholder='Search...' 
              />
              <HiOutlineSearch onClick={() => navigate('/shop')} className='text-gray-400' />
            </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - మునుపటిలాగే 4 ఐకాన్లు మాత్రమే */}
      <div className='fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 md:hidden z-50 rounded-t-[2rem] shadow-lg'>
        <NavLink to='/' className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
          <HiOutlineHome className='text-2xl' /><p className='text-[10px] font-bold uppercase'>Home</p>
        </NavLink>
        <NavLink to='/shop' className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
          <HiOutlineViewGrid className='text-2xl' /><p className='text-[10px] font-bold uppercase'>Shop</p>
        </NavLink>
        <NavLink to='/orders' className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
          <HiOutlineTruck className='text-2xl' /><p className='text-[10px] font-bold uppercase'>Orders</p>
        </NavLink>
        <NavLink to='/profile' className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
          <HiOutlineUser className='text-2xl' /><p className='text-[10px] font-bold uppercase'>Profile</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;