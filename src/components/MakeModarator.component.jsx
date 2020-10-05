import React, { useState } from 'react'
import { useSetRecoilState, useRecoilState } from 'recoil'
import { searchOpenState, alertSnackbarState, loaderState } from '../recoil/atoms'
import { useEffect } from 'react';
import Search from '../molecules/Search.mole';
import SearchPreviewItem from '../molecules/SearchPreviewItem.mole';
import { searchUser, getSingleUser, createModarator } from '../request/user.requset';
import { checkStatus, catchAsync, extractFilter } from '../utils';
import { useRef } from 'react';
import UserView from './UserView.component';
import { editUserState } from '../recoil/user/user.atoms';



export default function MakeModarator() {

    const setSearchPopup = useSetRecoilState(searchOpenState);
    const setAlert = useSetRecoilState(alertSnackbarState);
    const setLoader = useSetRecoilState(loaderState);
    const [editUser,setEditUser] = useRecoilState(editUserState);
    const [oldState,setOldState] = useState(null)
    const [searchItems, setSearchItems] = useState(null)
    const [searchKey, setSearchKey] = useState('');
    const [searchLoader,setSearchLoader] = useState(false);
    const timer = useRef();

    useEffect(() => {
        if(!editUser){
            setSearchPopup(true)
        }

        return ()=>{
            setEditUser(null)
        }
    }, [])

    const sendRequest = catchAsync(async()=>{
        if (searchKey !== '') {
            const response = await searchUser(searchKey);
            if (checkStatus(response)) {
                setSearchLoader(false)
                setSearchItems(response.data.users)
            }
        }else{
            setSearchLoader(false)
        }


    })

    useEffect(() => {
        if(!!searchKey){
            setSearchLoader(true)

        }
        clearTimeout(timer.current)
        timer.current = setTimeout(sendRequest, 1200)

    }, [searchKey])

    const handleItemClick = catchAsync(async(id) => {
        setLoader(true)
        const response = await getSingleUser(id);
        setLoader(false)
        if(checkStatus(response)){
            setEditUser(response.data.user)
            setOldState(response.data.user)
            setSearchPopup(false)
        }
    })

    const handleSearchKey = (e) => {
        setSearchKey(e.currentTarget.value);
    }

    const handleUpload = async()=>{
        setLoader(true)
        const response = await createModarator(extractFilter(editUser,oldState),editUser._id);
        setLoader(false)
        if(checkStatus(response)){
            setAlert({open: true,message: 'User Updated Successfully',severity: 'success'})

        }else{
            setAlert({open: true,message: response.data.message,severity: 'error'})
        }
    }

    return (
        <div>
            <UserView user={editUser} setUser={setEditUser} uploadHandler={handleUpload}/>
            <Search
                searchTitle="Type User Name or Email"
                items={searchItems}
                handleSearchKey={handleSearchKey}
                listItem={<SearchPreviewItem handleClick={handleItemClick} />}
                loading={searchLoader}
            />
        </div>
    )
}
