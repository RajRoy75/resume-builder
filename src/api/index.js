import { auth } from "../config/firebase.config"

export const getUserDetail = ()=>{
    return new Promise((resolve,reject)=>{
        const unsubscribe = auth.onAuthStateChanged((userCred)=>{
            if(userCred){
                const userData = userCred.providerData[0];
                resolve(userData);
                console.log(userData);
            }else{
                // reject(new Error('User is not authenticated'))
                reject(console.log('user not authenticated'));
            }
            unsubscribe();
        })
    })
}