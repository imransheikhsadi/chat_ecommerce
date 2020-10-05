import React from 'react'
import UserView from './UserView.component';
import { userState } from '../recoil/user/user.atoms';
import { alertSnackbarState } from '../recoil/atoms';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { updateUser } from '../request/user.requset';
import { checkStatus, filter } from '../utils';
import { useFetch } from '../customHooks';


export default function Profile() {

    const [user,setUser] = useRecoilState(userState);
    const setAlert = useSetRecoilState(alertSnackbarState);
    const fetch = useFetch()

    

    const handleupdate = async(updatedUser)=>{
        const response = await fetch(()=>updateUser(filter(updatedUser,'name'),user._id));
        if(checkStatus(response)){
            setAlert({open: true,message: 'User Updated Successfully',severity: 'success'})

        }
    }

    return (
       <div className="">
           <UserView user={user} setUser={setUser} uploadHandler={handleupdate} />
       </div>
    )
}
