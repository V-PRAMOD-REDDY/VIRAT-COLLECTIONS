import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  const subtotal = getCartAmount();
  const shipping = subtotal > 1999 || subtotal === 0 ? 0 : Number(delivery_fee);
  const total = subtotal + shipping;

  return (
    <div className='w-full'>
      <div className='text-2xl font-black uppercase tracking-tighter italic border-b-4 border-black inline-block mb-6'>
        <h2>Cart Totals</h2>
      </div>
      <div className='flex flex-col gap-3 mt-2 text-sm'>
        <div className='flex justify-between items-center'>
          <p className='text-gray-500 font-bold uppercase tracking-widest text-xs'>Subtotal</p>
          <p className='font-black text-gray-900'>{currency} {subtotal.toLocaleString('en-IN')}.00</p>
        </div>
        <hr className='border-gray-100' />
        <div className='flex justify-between items-center'>
          <p className='text-gray-500 font-bold uppercase tracking-widest text-xs'>Shipping Fee</p>
          <p className={`font-black ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>{shipping === 0 ? 'FREE' : `${currency} ${shipping}.00`}</p>
        </div>
        <hr className='border-gray-100' />
        <div className='flex justify-between items-center font-black text-xl text-gray-900 mt-2'>
          <p className='uppercase tracking-tighter italic'>Total</p>
          <p>{currency} {total.toLocaleString('en-IN')}.00</p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;