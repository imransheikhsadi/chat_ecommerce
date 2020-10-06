import { useRef, useEffect, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { alertSnackbarState, loaderState } from "./recoil/atoms";
import { userState } from "./recoil/user/user.atoms";
import { catchAsync, checkStatus } from "./utils";

export const useIsInit = ()=>{
    const mountRef = useRef(true);

    useEffect(()=>{
        mountRef.current = false
    },[])

    return mountRef.current;
}

export const useIsAdmin = ()=>{
    const user = useRecoilValue(userState);
    const userRef = useRef(false);

    useEffect(()=>{
        if(!user)return;
        if(user.role === 'admin'){
            userRef.current = true;
        }
    },[user])

    return userRef.current;
}

export const useIsModarator = ()=>{
    const user = useRecoilValue(userState);
    const [state,setState] = useState(false);

    useEffect(()=>{
        if(!user)return;
        if(user.role === 'admin' || user.role === 'worker'){
            setState(true)
        }
    },[user])

    return state;
}

export const useFetch = ()=>{
    const setAlert = useSetRecoilState(alertSnackbarState);
    const setLoader = useSetRecoilState(loaderState);

    const fetch = async(fetcher,arg,customLoader)=>{
        customLoader?customLoader(true):setLoader(true);
        const response = await fetcher(arg);
        customLoader?customLoader(false):setLoader(false);
        
        if(!checkStatus(response)){
            setAlert({open: true,message: response.data.message,severity: 'error'})
        }
        return response
    }

    return catchAsync(fetch);
}

