import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
    const { token, backendUrl } = useContext(ShopContext);
    const [isEdit, setIsEdit] = useState(false); 
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '', // విడిగా మొబైల్ నంబర్ కోసం
        address: { street: '', city: '', state: '', zipcode: '', country: '' }
    });

    // 1. యూజర్ డేటాను బ్యాకెండ్ నుండి పొందడం
    const getUserProfile = async () => {
        try {
            // authMiddleware లోని userId కోసం POST రిక్వెస్ట్ పంపుతున్నాము
            const response = await axios.post(`${backendUrl}/api/user/get-profile`, {}, { headers: { token } });
            if (response.data.success) {
                setUserData(response.data.user);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to load profile data");
        }
    };

    // 2. ఇన్పుట్ ఫీల్డ్స్ మారినప్పుడు స్టేట్ అప్‌డేట్ చేయడం
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        
        // అడ్రస్ ఆబ్జెక్ట్ లోని ఫీల్డ్స్ అయితే
        if (['street', 'city', 'state', 'zipcode', 'country'].includes(name)) {
            setUserData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value
                }
            }));
        } else {
            // పేరు మరియు ఫోన్ నంబర్ కోసం
            setUserData(prev => ({ ...prev, [name]: value }));
        }
    };

    // 3. మార్చిన వివరాలను డేటాబేస్ లో సేవ్ చేయడం
    const handleUpdate = async () => {
        try {
            // userData లో ఇప్పుడు 'phone' కూడా భాగంగా ఉంది
            const response = await axios.post(`${backendUrl}/api/user/update-profile`, userData, { headers: { token } });
            if (response.data.success) {
                toast.success("Profile Updated Successfully! 🎉");
                setIsEdit(false); 
                getUserProfile(); // అప్‌డేట్ అయిన డేటాను మళ్ళీ లోడ్ చేయడం
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (token) getUserProfile();
    }, [token]);

    return (
        <div className='px-4 md:px-10 py-10 min-h-screen border-t bg-gray-50'>
            <div className='max-w-2xl m-auto bg-white p-8 rounded-2xl shadow-md border border-gray-100'>
                
                <div className='flex justify-between items-center mb-8 border-b pb-4'>
                    <h2 className='text-2xl font-black uppercase tracking-tighter text-gray-800'>My Profile</h2>
                    <button 
                        onClick={() => { if(isEdit) getUserProfile(); setIsEdit(!isEdit); }}
                        className='border-2 border-black px-6 py-1.5 rounded-full text-sm font-black hover:bg-black hover:text-white transition-all active:scale-95'>
                        {isEdit ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                <div className='flex flex-col gap-6'>
                    {/* Full Name Section */}
                    <div>
                        <p className='text-xs font-black uppercase text-gray-400'>Full Name</p>
                        {isEdit ? (
                            <input name="name" type="text" className='w-full border-2 rounded-xl p-3 mt-2 outline-none focus:border-black font-bold' 
                            value={userData.name || ''} onChange={onChangeHandler} />
                        ) : (
                            <p className='text-xl font-bold text-gray-900 mt-1'>{userData.name || "Not Provided"}</p>
                        )}
                    </div>

                    {/* Phone Number Section (సమస్య ఇక్కడ పరిష్కరించబడింది) */}
                    <div>
                        <p className='text-xs font-black uppercase text-gray-400'>Phone Number</p>
                        {isEdit ? (
                            <input 
                                name="phone" // 👈 ఈ పేరు బ్యాకెండ్ కంట్రోలర్ తో మ్యాచ్ అవ్వాలి
                                type="text" 
                                className='w-full border-2 rounded-xl p-3 mt-2 outline-none focus:border-black font-bold' 
                                value={userData.phone || ''} 
                                onChange={onChangeHandler} 
                            />
                        ) : (
                            <p className='text-xl font-bold text-gray-900 mt-1'>{userData.phone || "Add Phone Number"}</p>
                        )}
                    </div>

                    <hr className='border-gray-100' />

                    {/* Delivery Address Section */}
                    <div>
                        <p className='font-black uppercase text-sm mb-4 text-blue-600 tracking-widest'>Delivery Address</p>
                        {isEdit ? (
                            <div className='flex flex-col gap-3'>
                                <input name="street" type="text" placeholder='Street' className='border-2 p-3 rounded-xl font-bold outline-none' 
                                value={userData.address?.street || ''} onChange={onChangeHandler} />
                                
                                <div className='grid grid-cols-2 gap-3'>
                                    <input name="city" type="text" placeholder='City' className='border-2 p-3 rounded-xl font-bold outline-none' 
                                    value={userData.address?.city || ''} onChange={onChangeHandler} />
                                    <input name="state" type="text" placeholder='State' className='border-2 p-3 rounded-xl font-bold outline-none' 
                                    value={userData.address?.state || ''} onChange={onChangeHandler} />
                                </div>

                                <div className='grid grid-cols-2 gap-3'>
                                    <input name="zipcode" type="text" placeholder='Zipcode' className='border-2 p-3 rounded-xl font-bold outline-none' 
                                    value={userData.address?.zipcode || ''} onChange={onChangeHandler} />
                                    <input name="country" type="text" placeholder='Country' className='border-2 p-3 rounded-xl font-bold outline-none' 
                                    value={userData.address?.country || ''} onChange={onChangeHandler} />
                                </div>
                            </div>
                        ) : (
                            <div className='bg-gray-50 p-5 rounded-2xl border border-dashed border-gray-200'>
                                <p className='text-gray-800 font-bold text-lg'>{userData.address?.street || "No address saved"}</p>
                                <p className='text-gray-500 font-bold'>{userData.address?.city}{userData.address?.city && ','} {userData.address?.state}</p>
                                <p className='text-gray-500 font-bold uppercase text-xs mt-1'>{userData.address?.zipcode}{userData.address?.zipcode && ','} {userData.address?.country}</p>
                            </div>
                        )}
                    </div>

                    {isEdit && (
                        <button onClick={handleUpdate} className='bg-black text-white font-black py-4 rounded-2xl hover:bg-gray-800 transition-all uppercase tracking-widest mt-4 shadow-xl active:scale-95'>
                            Save Changes
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;