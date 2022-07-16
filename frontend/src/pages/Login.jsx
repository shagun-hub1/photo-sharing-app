import React from 'react';
import GoogleLogin from 'react-google-login'
import {Navigate, useNavigate} from 'react-router-dom'
import {FcGoogle} from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import {client} from '../client'

const Login = () => {

    const navigate=useNavigate()

    const responseGoogle=(response)=>{
        localStorage.setItem('user',JSON.stringify(response.profileObj))

        const {name,googleId,imageUrl}=response?.profileObj

        const doc={
            _id:googleId,
            _type:'user',
            userName:name,
            image:imageUrl
        }

        client.createIfNotExists(doc)
        .then(()=>{
            
           
            navigate('/',{replace:true})
        })
    }

  return  ( 
    <>
     
          <div className='relative  w-full' style={{height:'100vh'}}>
              <video
                  src={shareVideo}
                  type='video/mp4'
                  loop
                  controls={false}
                  muted
                  autoPlay
                  className='h-full w-full object-cover'
                  />

              <div className='absolute flex flex-col justify-center items-center top-0 left-0 bottom-0 right-0 bg-blackOverlay'>
                    <div className='p-5'>
                            <img
                            src={logo}
                            width='130px'
                            alt='logo'
                            />
                    </div>

                    <div className='shadow-2xl'>
                        <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                        render={(renderProps)=>(
                            <button
                            type='button'
                            className='bg-white flex justify-center items-center p-2 rounded-lg cursor-pointer outline-none'
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            >
                                <FcGoogle className='mr-4' /> SignIn with Google 
                            </button>
                        )}
                        
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy='single_host_origin'
                        />
                    </div>
              </div>
          </div>
  
     
      
    </>
    )
};

export default Login;
