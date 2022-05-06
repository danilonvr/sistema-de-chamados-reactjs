import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc,doc,getDoc } from "firebase/firestore";
import { useState,useEffect,createContext } from "react";
import { auth, db } from '../services/firebase';
import { toast } from "react-toastify";

//NOME DO CONTEXTO, QUE DEVERA SER IMPORTADO NOS OUTROS FILES!!!!!!!
export const AuthContext = createContext({})

export default function AuthProvider({children}){

    const [user,setUser] = useState(null)
    const [loadingAuth,setLoadingAuth] = useState(false)
    const [loading,setLoading] = useState(true)

    useEffect(()=>{

        function loadStorage(){
            const storageUser = localStorage.getItem('SistemaUser')
            if(storageUser){
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }
    
            setLoading(false)
        }
        loadStorage();
      
    },[])

    async function signUp(email,password,nome,sobrenome){
        setLoadingAuth(true);
        await createUserWithEmailAndPassword(auth, email, password)
        .then(async (value)=>{
            const colRef = collection(db, 'usuario')
            setDoc(doc(colRef, value.user.uid),{
                Nome: nome,
                Sobrenome: sobrenome,
                AvatarUrl: null,
                Email: email
            })
            .then(()=>{
                let data = {
                    uid: value.user.uid,
                    Nome: nome,
                    Sobrenome: sobrenome,
                    Email: value.user.email,
                    AvatarUrl: null
                }
                setUser(data)
                storageUser(data)
                toast.success(`Seja bem vindo, ${nome} ${sobrenome}`)
                setLoadingAuth(false)
                
            })
        }).catch((error)=>{
            console.log(error)
            toast.error('Algo de errado aconteceu!')
            setLoadingAuth(false)
            
        })
    }

    function storageUser(data){
        localStorage.setItem('SistemaUser', JSON.stringify(data))
    }

    async function signOut(){
        signOut(auth);
        localStorage.removeItem('SistemaUser')
        setUser(null)
    }

    async function signIn(email,password){
        setLoadingAuth(true)
        await signInWithEmailAndPassword(auth,email,password)
        .then(async (value)=>{
            const docRef = doc(db, 'usuario', value.user.uid)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                let data = {
                    uid: value.user.uid,
                    Nome: docSnap.data().Nome,
                    Sobrenome: docSnap.data().Sobrenome,
                    Email: value.user.email,
                    AvatarUrl: docSnap.data().AvatarUrl
                }

                setUser(data)
                storageUser(data)
                toast.success(`Seja bem vindo, ${docSnap.data().Nome} ${docSnap.data().Sobrenome}`)
                setLoadingAuth(false)
            }
        })
        .catch((error) => {
            console.log(error)
            toast.error('Algo de errado aconteceu!')
            setLoadingAuth(false)
        })
    }

    return(
        <AuthContext.Provider value={{
            signed: !!user, 
            user, 
            loading,
            signUp,
            signOut,
            signIn,
            loadingAuth,
            setUser,
            storageUser
        }}
        >

            {children}
        </AuthContext.Provider>
    )
}