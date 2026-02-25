import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const CartTotal = () => {
    const { currency, delivery_fee, getCartTotal } = useContext(ShopContext);

    const subtotal = Number(getCartTotal()) || 0;
    const shipping = subtotal > 1999 || subtotal === 0 ? 0 : Number(delivery_fee);
    const total = subtotal + shipping;

    return (
        <div className='w-full'>
            <div className='text-2xl font-bold uppercase'>
                <h2>Cart Totals</h2>
            </div>

            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>{currency} {subtotal.toLocaleString()}.00</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Shipping Fee</p>
                    <p className={shipping === 0 ? 'text-green-600 font-bold' : ''}>
                        {currency} {shipping}.00
                    </p>
                </div>
                <hr />
                <div className='flex justify-between font-bold text-lg'>
                    <p>Total</p>
                    <p>{currency} {total.toLocaleString()}.00</p>
                </div>
            </div>
        </div>
    )
}

export default CartTotal