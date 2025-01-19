import { arrayRemove, arrayUnion, collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config"
import { toast } from "react-toastify";

export const getUserDetail = ()=>{
    return new Promise((resolve,reject)=>{
        const unsubscribe = auth.onAuthStateChanged((userCred)=>{
            if(userCred){
                const userData = userCred.providerData[0];
                const unsubscribe = onSnapshot(
                    doc(db,"users", userData?.uid),
                    (_doc)=>{
                        if(_doc.exists()){
                            resolve(_doc.data());
                        }else{
                            setDoc(doc(db,"users",userData?.uid),userData).then(()=>{
                                resolve(userData);
                            })
                        }
                    }
                );
                return unsubscribe;
            }else{
                // reject(new Error('User is not authenticated'))
                reject(console.log('user not authenticated'));
            }
            unsubscribe();
        })
    })
}

export const getTemplates = ()=>{
    return new Promise((resolve,reject)=>{
        const tempalteQuery = query(
            collection(db,"templates"),
            orderBy("timestamp","asc")
        );
        const unsub = onSnapshot(tempalteQuery,(querySnap)=>{
            const templates = querySnap.docs.map((doc)=> doc.data());
            resolve(templates);
        });
        return unsub;
    })
}

export const saveToCollection = async(user,data)=>{
    if(!user?.collections?.includes(data?._id)){
        const docRef = doc(db,'users',user?.uid);
        await updateDoc(docRef,{collections:arrayUnion(data?._id)})
        .then(()=> toast.success('Added to Collections'))
        .catch((err)=> toast.error(`Error: ${err.message}`))
    }else{
        const docRef = doc(db,'users',user?.uid);
        await updateDoc(docRef,{collections:arrayRemove(data?._id)})
        .then(()=> toast.success('Remove from Collections'))
        .catch((err)=> toast.error(`Error: ${err.message}`))
    }
}
export const saveToFavourite = async(user,data)=>{
    if(!data?.favourites?.includes(user.uid)){
        const docRef = doc(db,'templates',data?._id);
        await updateDoc(docRef,{favourites:arrayUnion(user?.uid)})
        .then(()=> toast.success('Added to Favourite'))
        .catch((err)=> toast.error(`Error: ${err.message}`))
    }else{
        const docRef = doc(db,'templates',data?._id);
        await updateDoc(docRef,{favourites:arrayRemove(user?.uid)})
        .then(()=> toast.success('Remove from Favourite'))
        .catch((err)=> toast.error(`Error: ${err.message}`))
    }
}


export const getTemplateDetails = async (templateId)=>{
    return new Promise((resolve,reject)=>{
        const unsubscribe = onSnapshot(doc(db,"templates", templateId), (doc)=>{
            resolve(doc.data());
        });
        return unsubscribe;
    })
}
export const getTemplateDetailEditByUser = (uid, id) => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(
        doc(db, "users", uid, "resumes", id),
        (doc) => {
          resolve(doc.data());
        }
      );
  
      return unsubscribe;
    });
  };
