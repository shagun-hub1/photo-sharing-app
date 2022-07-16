import React,{useState,useEffect} from 'react';
import {useParams} from 'react-router-dom'

import {client} from '../client'
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import {searchQuery,feedQuery} from '../utils/data'

const Feed = () => {

  const [loading, setloading] = useState(false);
  const [pins,setPins]=useState(null)
  const {categoryId}=useParams()
  

  useEffect(()=>{
    setloading(true)
    if(categoryId){
      const query = searchQuery(categoryId)

      client.fetch(query)
      .then((data)=>{
        setPins(data)
        setloading(false)
      })
    }else{
      client.fetch(feedQuery)
      .then((data)=>{
       
        setPins(data)
        setloading(false)
      })
    }

  },[categoryId])

  if (loading)
  return <Spinner message='We are adding new ideas to your feed!'/>

  if(!pins?.length) return <h2 className='text-purple-600 text-bold text-xl text-center'>No Pins Available</h2>

  return (
    <>
    {pins && <MasonryLayout pins={pins} />}
    </>
  );
};

export default Feed;
