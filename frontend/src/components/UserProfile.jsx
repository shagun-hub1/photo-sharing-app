import React,{useState,useEffect} from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai';
import {GoogleLogout} from 'react-google-login'
import { client } from '../client';
import { userCreatedPinsQuery,userQuery,userSavedPins, userSavedPinsQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { fetchUser } from '../utils/fetchUser';


const randomImage='https://source.unsplash.com/1600x900/?nature,photography,technology'
 
const UserProfile = () => {
  const [user,setUser]=useState(null);
  const [pins,setPins]=useState(null);
  const [text,setText]=useState('Created')
  const [activeBtn,setActiveBtn]=useState('Created');
  const navigate=useNavigate()
  const [loggedInUser,setLoggedInUser]=useState(null)


  const {userId}=useParams()

  useEffect(()=>{
      const query=userQuery(userId)

      const loinuser=fetchUser()
      setLoggedInUser(loinuser)

      client.fetch(query)
      .then((data)=>{
        setUser(data[0])
      })
  },[userId])

  useEffect(()=>{
      if(text==='Created'){
        const createdPinsQuerry = userCreatedPinsQuery(userId)

        client.fetch(createdPinsQuerry)
        .then((data)=>{
          setPins(data)
        })
      }else{
        const savedPinsQuery = userSavedPinsQuery(userId)

        client.fetch(savedPinsQuery)
        .then((data)=>{
          setPins(data)
        })
      }
  },[text,userId])

  const logout=()=>{
    localStorage.clear()
    navigate('/login')
  }

  const activeBtnStyles=`bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none`
  const notActiveBtnStyles=`bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none`

  if(!user) return <Spinner message='Loading Profile'/>
  return (
    <>
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
          <div className='relative flex flex-col mb-7'>
              <div className='flex flex-col justify-center items-center'>
                  <img 
                  src={randomImage}
                  className='w-full h-370 2xl:h-510 shadow-lg object-cover' 
                  alt="banner" />
                  <img
                  className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
                  src={user?.image}
                  alt='user-pic'
                  />
                  <h1 className='font-bold text-3xl text-center mt-3'>{user?.userName}</h1>
                  <div className='absolute top-0 z-1 right-0 p-2'>
                      {userId===loggedInUser?.googleId &&(
                        <GoogleLogout
                        clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                        render={(renderProps)=>(
                            <button
                            type='button'
                            className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            >
                                <AiOutlineLogout color='red' fontSize={21}/> LogOut 
                            </button>
                        )}
                        
                        onLogoutSuccess={logout}
                        cookiePolicy='single_host_origin'
                        />
                      )}
                  </div>

              </div>
              <div className='text-center mb-7'>
                  <button
                  type='button'
                  onClick={(e)=>{
                    setText(e.target.textContent)
                    setActiveBtn('Created')
                  }}

                  className={`${activeBtn==='Created' ? activeBtnStyles : notActiveBtnStyles}`}
                  >
                    Created

                  </button>
                  <button
                  type='button'
                  onClick={(e)=>{
                    setText(e.target.textContent)
                    setActiveBtn('Saved')
                  }}

                  className={`${activeBtn==='Saved' ? activeBtnStyles : notActiveBtnStyles}`}
                  >
                    Saved
                  </button>

                  {pins?.length ?
                  <div className='px-2'>
                      <MasonryLayout pins={pins}/>
                  </div>
                  : 
                  <div className='flex justify-center items-center font-bold text-xl w-full mt-2'>
                      No Pins Found
                  </div>
                  }

              </div>
          </div>
      </div>

    </div>
    </>
  );
};

export default UserProfile;
