import React from 'react'
import { FaChevronRight } from 'react-icons/fa6'
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup} from 'firebase/auth';
import {auth} from "../config/firebase.config";


const googelAuthProvider = new GoogleAuthProvider();
const githubAuthProvider = new GithubAuthProvider();

function AuthButton({Icon,label,provider}) { 
  const handleClick = async () =>{
    switch(provider){
      case "GoogleAuthProvider":
        // await signInWithPopup(auth,googelAuthProvider);
        await signInWithPopup(auth,googelAuthProvider).then((result)=>{
          const user = result.user;
          console.log(user);
        }).catch((err)=>{
          console.log(err.message);
        });
        break;
      
      case "GithubAuthProvider":
        await signInWithPopup(auth,githubAuthProvider).then((result)=>{
          const user = result.user;
          console.log(user);
        }).catch((err)=>{
          console.log(err.message);
        });
        break;
      default:
        console.log('GithubAuthProvider');
        break

    }
  }
  return (
    <>
    <div onClick = {handleClick} className='w-full px-4 py-3 rounded-md border-2 border-blue-700 flex items-center justify-between cursor-pointer group hover:bg-blue-700 active:scale-95 hover:shadow-md duration-150'>
        <Icon className="text-txtPrimary text-xl group-hover:text-white"/>
        <p className='text-txtPrimary text-lg group-hover:text-white'>{label}</p>
        <FaChevronRight className='text-txtPrimary text-base group-hover:text-white'/>
        
    </div>
    </>
    
  )
}

export default AuthButton