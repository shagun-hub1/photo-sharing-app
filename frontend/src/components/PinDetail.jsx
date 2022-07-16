import React,{useState,useEffect} from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link,useParams } from 'react-router-dom';
import { v4 as uuivd4 } from 'uuid';

import { client,urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner'
import { pinDetailMorePinQuery,pinDetailQuery } from '../utils/data';

const PinDetail = ({user}) => {

  const [pins,setPins]=useState(null);
  const [pinDetails,setPinDetails]=useState(null);
  const [comment,setComment]=useState('');
  const [addingComment,setAddingComment]=useState(false);

  const {pinId}=useParams();

  useEffect(()=>{
    fetchPinDetails()
  },[pinId])
  
  const fetchPinDetails=()=>{
    let query=pinDetailQuery(pinId)
    
    if(query){
      client.fetch(query)
      .then((data)=>{
        setPinDetails(data[0])
        console.log(data)
        
        if(data[0]){
          query=pinDetailMorePinQuery(data[0])
          
          client.fetch(query)
          .then((res)=>setPins(res))
        }
      })
    }
  }
  
  const addComment=()=>{
    if(comment){
      setAddingComment(true)

      client
      .patch(pinId)
      .setIfMissing({comments:[]})
      .insert('after','comments[-1]',[{
        comment,
        _key:uuivd4(),
        postedBy:{
          _type:'postedBy',
          _ref:user?._id
        }
      }])
      .commit()
      .then(()=>{
        fetchPinDetails();
        setComment('')
        setAddingComment(false)
      })
    }
  }

  if(!pinDetails) return <Spinner message='Loading Pin'/>

  return (
    <>
      <div className='flex xl:flex-row flex-col m-auto bg-white' style={{maxWidth:'1500px',borderRadius:'32px'}}>

            <div className='flex justify-center items-center md:items-start flex-initial'>
              <img 
              src={pinDetails?.image && urlFor(pinDetails?.image).width(250).url()} alt="" 
              className='rounded-t-3xl rounded-b-lg'
              />
            </div>
            <div className='w-full p-5 flex-1 xl:min-w-620'>
                  <div className='flex items-center justify-between '>
                      <div className='flex gap-2 items-center'>
                      <a
                            href={`${pinDetails?.image?.asset?.url}?dl=`}
                            download
                            onClick={(e)=>e.stopPropagation()}
                            className='bg-white w-9 h-9 rounded-full flex justify-center items-center text-dark text-xl opactiy-75 hover:opacity-100 hover:shadow-md outline-none'
                            >
                            <MdDownloadForOffline/>
                      </a>
                      </div>
                      <a href={pinDetails.destination} target='_blank' rel='noreferrer'>{pinDetails.destination}</a>
                  </div>
                  <div>
                      <h1 className='text-4xl font-bold break-words mt-3 text-center'>
                        {pinDetails?.title}
                      </h1>
                      <p className='mt-3 text-center'>
                          {pinDetails.about}
                      </p>
                  </div>
            <Link to={`/user-profile/${pinDetails?.postedBy?._id}`} className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
            <img
            className='w-8 h-8 rounded-full object-cover'
            src={pinDetails?.postedBy?.image}
            />  
            <p className='font-semibold captalize'>{pinDetails.postedBy?.userName}</p>    
        </Link>
        <h2 className='mt-5 text-2xl'>Comments</h2>
            <div className=' overflow-y-auto ' style={{maxHeight:'120px'}}>
                {pinDetails?.comments?.map((com,i)=>(
                  <div className='flex  gap-2 mt-5 items-center bg-white rounded-lg' key={i}>
                    <img src={com.postedBy.image}
                    alt='uer-profile'
                    className='w-10 h-10 rounded-full cursor-pointer'
                    />
                    <div className='flex flex-col'>
                      <p className='font-bold'>{com?.postedBy?.userName}</p>
                      <p>{com.comment}</p>
                    </div>
                  </div>
                ))}
            </div>
            <div className='flex flex-wrap mt-6 gap-3 items-center'>
            <Link to={`/user-profile/${user?._id}`} >
            <img
            className='w-8 h-8 rounded-full object-cover cursor-pointer'
            src={user?.image}
            />  
            </Link>
            <input
            className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
            type='text'
            placeholder='Add a comment'
            value={comment}
            onChange={(e)=>setComment(e.target.value)}
            />
            <button
            type='button'
            className='bg-red-500 text-white rounded-full px-6  py-2 font-semibold text-base outline-none'
            onClick={addComment}
            >
              {addingComment ? 'Posting the comment... ' : 'Post'}

            </button>
            </div>
          </div>
      </div>

      {pins?.length>0 ? (
        <>
        <h2 className='text-center font-bold text-2xl mt-8 mb-4'>More Like This</h2>
        <MasonryLayout pins={pins}/>
        </>
      ):(
        <Spinner message='Loading similar pins...'/>
      )}
    </>
  );
};

export default PinDetail;
