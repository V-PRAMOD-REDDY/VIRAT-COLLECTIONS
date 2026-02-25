import React from 'react'

const Categories = () => {
  const categories = [
    { name: 'T-Shirts', image: 'https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Jeans', image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Jackets', image: 'https://images.pexels.com/photos/1617030/pexels-photo-1617030.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Shirts', image: 'https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=600' }
  ]

  return (
    <div className='px-4 md:px-10 py-10'>
      <h2 className='text-2xl font-bold mb-6'>Shop By Category</h2>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {categories.map((item, index) => (
          <div key={index} className='relative rounded-lg overflow-hidden h-60 group cursor-pointer'>
            <img src={item.image} className='w-full h-full object-cover group-hover:scale-110 transition-all duration-300' alt={item.name} />
            <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
              <p className='text-white font-bold text-xl'>{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories