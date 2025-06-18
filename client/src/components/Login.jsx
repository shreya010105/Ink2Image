import { assets } from '@/assets/assets'
import { AppContext } from '@/context/AppContext'
import React, { useContext, useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
    const [state, setState] = useState('Login')
    const {setShowLogin,backendUrl,setToken,setUser} = useContext(AppContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const onSubmitHandler = async (e) => {
    e.preventDefault();

  try {
    if (state === 'Login') {
      // ✅ Optional Debug
      console.log("Trying to login with:", { email, password });

      const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });

      console.log("Login Response:", data); // ✅ Important for debugging

      if (data.success) {
        setToken(data.accessToken); // ✅ fix here
        setUser(data.user);
        localStorage.setItem('token', data.accessToken); // ✅ fix here
        setShowLogin(false);
      } else {
        toast.error(data.message || "Login failed");
      }
    } else {
      // ✅ Optional Debug
      console.log("Trying to register with:", { name, email, password });

      const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
        name,
        email,
        password,
      });

      console.log("Register Response:", data); // ✅ Important for debugging

      if (data.success) {
        setToken(data.accessToken); // ✅ fix here
        setUser(data.user);
        localStorage.setItem('token', data.accessToken); // ✅ fix here
      } else {
        toast.error(data.message || "Login failed");
      }
    }
  } catch (e) {
    console.error("Auth error:", e.response?.data || e.message); // ✅ Always log it
    toast.error(e.response?.data?.message || 'Something went wrong!');
  }
}


    useEffect(()=>{
        document.body.style.overflow = 'hidden'; // hiddes the content to scroll without login

        return ()=>{
            document.body.style.overflow = 'unset';
        }
    },[])
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
        <motion.form onSubmit={onSubmitHandler}
        className='relative bg-white p-10 rounded-xl text-slate-500'
        initial={{opacity:0.2,y:50}}
        transition={{duration:0.3}}
        whileInView={{opacity:1,y:0}}
        viewport={{once:true}}
        >
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
            <p className='text-sm'>Welcome back! Please sign in to continue</p>

            {state !== 'Login' && <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.profile_icon} alt="" width={30}/>
                <input 
                 type="text" 
                 placeholder='Full Name' 
                 required 
                 value={name}
                 onChange={(e)=>setName(e.target.value)}
                className='outline-none text-sm'/>
            </div>
            }
            
            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.email_icon} alt="" width={20}/>
                <input 
                type="email" 
                placeholder='abc@gmail.com' 
                required 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className='outline-none text-sm'/>
            </div>
            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.lock_icon} alt="" width={20}/>
                <input 
                type="password" 
                placeholder='Password' 
                required 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className='outline-none text-sm'/>
            </div>
            <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forget Password?</p>
            <button className='bg-blue-600 w-full text-white py-2 rounded-full'>
                {state === 'Login' ? 'Login' : 'Create account' }
            </button>

            {state === 'Login' 
            ? 
             <p className='mt-5 text-center'>
                Don't have an account? 
                <span className='text-blue-600 cursor-pointer' onClick={()=>setState('Sign Up')}>Sign Up</span>
            </p>
            :
            <p className='mt-5 text-center'>
                Already have an account? 
                <span className='text-blue-600 cursor-pointer' onClick={()=>setState('Login')}>Login</span>
            </p>
            }

            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer' />
        </motion.form>
    </div>
  )
}

export default Login