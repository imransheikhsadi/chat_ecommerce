import React, { useState, useRef, useEffect } from 'react'
import SearchPreviewItem from '../molecules/SearchPreviewItem.mole';
import { catchAsync, checkStatus } from '../utils';
import { searchProduct } from '../request/product.request';
import { useRecoilState } from 'recoil';
import { searchOpenState, shopQueryState } from '../recoil/atoms';
import Search from './Search.mole';
import { useSetRecoilState } from 'recoil';
import { useHistory } from 'react-router-dom';


export default function ProductSearch({getId}) {
    const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);
    const [searchKey, setSearchKey] = useState('');
    const timer = useRef();
    const [searchItems, setSearchItems] = useState([])
    const [searchLoader, setSearchLoader] = useState(false)
    const setSearchQuery = useSetRecoilState(shopQueryState)
    const keyRef = useRef('');


    const sendRequest = catchAsync(async () => {
        if (searchKey !== '') {
            setSearchLoader(true)
            const response = await searchProduct(searchKey);
            setSearchLoader(false)
            if (checkStatus(response)) {
                // setSearchOpen(false)
                setSearchItems(response.data.products)
            }
            console.log(response)
        } else {
            // setSearchOpen(false)
        }


    })

    useEffect(() => {
        console.log('added')
        document.addEventListener("keypress", handleEvent);
    }, [])

    useEffect(() => {
        setSearchItems([]);
        setSearchKey('')
        if (searchOpen) {

        }
        return () => {
            if (searchOpen) {
                document.removeEventListener('keypress',handleEvent);
            }
        }
    }, [searchOpen])

   


    const handleEvent = (event) => {
        if (event.key === 'Enter') {
            search()
        }

    }


    const search = () => {
        if (!(keyRef.current === '')) {
            setSearchQuery({ search: keyRef.current })
            setSearchOpen(false)
        }
    }

    const handleView = (id,code) => {
        getId(id,code)
        setSearchOpen(false)
    }

    useEffect(() => {
        clearTimeout(timer.current)
        timer.current = setTimeout(sendRequest, 800)

    }, [searchKey])

    const handleSearchKey = (e) => {
        setSearchKey(e.currentTarget.value);
        keyRef.current = e.currentTarget.value
    }

    return (
        <Search
            searchTitle="Search For Products"
            items={searchItems.map(item => ({ name: item.name, _id: item._id, src: item.image.small[0], email: item.price,productCode: item.productCode }))}
            handleSearchKey={handleSearchKey}
            listItem={<SearchPreviewItem handleClick={handleView} />}
            loading={searchLoader}
            onSearch={search}
        />
    )
}
