import React,{useState} from 'react';
import {AiOutlineCloudUpload} from 'react-icons/ai'
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { client } from '../client';
import Spinner from './Spinner';
import { categories } from '../utils/data';

const CreatePin = ({user}) => {

  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState();
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [Wrongimage, setWrongImage] = useState(false);

  const navigate=useNavigate()

  const uploadImage=(e)=>{
    const {type,name}=e.target.files[0];

    if(type==='image/png' || type==='image/svg' || type==='image/jpeg' || type==='image/gif' || type==='image/tiff'){
      setWrongImage(false)
      setLoading(true)

      client.assets
      .upload('image',e.target.files[0],{contentType:type,filename:name} )
      .then((document)=>{
        setImage(document);
        setLoading(false)
      })
      .catch((err)=>console.log('Image Error',err))

    }else{
      setWrongImage(true)
    }
  }

  const savePin=()=>{
      if(title && destination && about &&image?._id && category){
          const doc={
            _type:'pin',
            title,
            about,
            destination,
            image:{
              _type:'image',
              asset:{
                _type:'reference',
                _ref:image?._id
              }
            },
            category,
            userId:user._id,
            postedBy:{
              _type:'postedBy',
              _ref:user?._id
            }
          }   
          
          client.create(doc)
          .then(()=>{
            navigate('/')
          })
      }else{
        setFields(true)

        setTimeout(()=>setFields(false),2000)
      }
  }

  return (
    <>
      <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
          {fields &&(
            <div className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
              Please Fill in All The Fields
            </div>
          )}

      <div className='flex flex-col lg:flex-row justify-center items-center bg-white p-3 lg:p-5 lg:w-4/5 w-full'>
            <div className='bg-secondaryColor  p-3 flex  flex-0.7 w-full'>
                <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
                    {loading && <Spinner/>}
                    {Wrongimage && <p>Wrong Image Type</p>}
                    {
                      !image ? (
                        <label>
                          <div className='flex flex-col items-center justify-center' style={{height:'100vh'}}>
                              <div className='flex flex-col justify-center items-center '>
                                  <p className='font-bold text-2xl '>
                                      <AiOutlineCloudUpload />
                                  </p>
                                  <p className='text-lg'>
                                      Click To Upload
                                  </p>
                                  <p className='mt-32 text-gray-400 '>use high quality JPG,SVG,PNG,GIF less than 20 MB</p>
                              </div>
                              <input 
                              type="file"
                              name='upload_image' 
                              onChange={uploadImage}
                              className='w-0 h-0'
                              />
                          </div>
                        </label>
                      ):
                      <div className='relative h-full'>
                        <img src={image?.url} alt='uploaded-image' className='h-full w-full'/>
                        <button
                        type='button'
                        onClick={()=>setImage(null)}
                        className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                        >
                          <MdDelete/>
                        </button>
                      </div>
                    }
                </div>
            </div>

            <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
                <input
                type='text'
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                placeholder='Add Your Title'
                className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2'
                />
                {user && (
                  <div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
                    <img src={user?.image} alt="user-image" className='w-10 h-10 rounded-full' />
                    <p className='font-bold'>{user?.userName}</p>
                  </div>
                )}
                <input
                type='text'
                value={about}
                onChange={(e)=>setAbout(e.target.value)}
                placeholder='What is Your Pin About'
                className='outline-none text-base sm:text-lg  border-b-2 border-gray-200 p-2'
                />
                <input
                type='text'
                value={destination}
                onChange={(e)=>setDestination(e.target.value)}
                placeholder='Add a destination link'
                className='outline-none text-base sm:text-lg  border-b-2 border-gray-200 p-2'
                />

                <div className='flex flex-col'>
                    <div>
                      <p className='mb-2 font-semibold text-lg sm:text-xl'>Choose Pin Category</p>
                      <select 
                      onChange={(e)=>setCategory(e.target.value)}
                      className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'
                      >
                        <option value='other' className='bg-white'>Select Category</option>
                        {categories.map((category)=>(
                          <option className='text-base border-0 outline-none capitalize bg-white text-black' value={category.name}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className='flex justify-end items-end mt-5'>
                          <button
                          type='button'
                          onClick={savePin}
                          classNAme='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none hover:shadow-md border-2 border-black-500'
                          >
                            Save Pin
                          </button>
                    </div>
                </div>
            </div>
      </div>

      </div>
    </>
  );
};

export default CreatePin;
