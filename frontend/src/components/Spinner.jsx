import React from 'react';
import {Circles} from 'react-loader-spinner'

const Spinner = ({message}) => {
  return (
      <>
      <div className='w-full flex-col h-full flex justify-center gap-2 items-center'>
        <Circles
        color='purple'
        height={50}
        width={100}
        className='m-7'
        />

        <p className='text-lg text-center px-2'>
            {message}
        </p>
      </div>
      </>
  );
};

export default Spinner;
