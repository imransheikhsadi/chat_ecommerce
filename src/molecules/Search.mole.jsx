import React from 'react'
import { Drawer, InputBase, Container, IconButton, makeStyles, Divider, Typography, ClickAwayListener, Box, MenuList, CircularProgress } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { searchOpenState } from '../recoil/atoms';
import Hide from './Hide.mole';

const createStyles = makeStyles(theme => ({
    search: {
        position: 'relative'
    },
    searchIcon: {
        position: 'absolute',
        right: 10,
        zIndex: 10
    },
    input: {
        fontSize: 30,
        color: theme.palette.text.primary,
        paddingRight: 60
    },
    content: {
        margin: '40px 0 40px 0'
    },
    icon: { fontSize: 30 }
}))

export default function Search({ listItem, handleSearchKey, searchTitle, items = [], loading,onSearch }) {

    const classes = createStyles()
    const [searchKey, setSearchKey] = useState('');
    const [searchOpen, setSearchOpen] = useRecoilState(searchOpenState);

    return (
        <Drawer open={searchOpen} anchor="top">
            <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
                <Container maxWidth="md">
                    <div className={classes.content}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Typography style={{ color: 'lightgray' }}>
                                What are you looking for?
                        </Typography>
                            <IconButton style={{ marginRight: 15 }} onClick={() => setSearchOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <Hide hide={loading} fallback={
                                    <CircularProgress />
                                }>
                                    <IconButton onClick={onSearch}>
                                        <SearchIcon className={classes.icon} />
                                    </IconButton>
                                </Hide>
                            </div>
                            <InputBase onChange={e => { setSearchKey(e.target.value); handleSearchKey(e) }} value={searchKey} placeholder={searchTitle} classes={{ root: classes.input }} fullWidth />
                        </div>
                        <Divider style={{ marginTop: 10 }} />
                        <Box maxHeight={200} overflow="auto">
                            <Hide hide={items?.length === 0}>
                                <MenuList>
                                    {items?.map(item =>
                                        React.cloneElement(listItem, { ...item })
                                    )}
                                </MenuList>
                            </Hide>
                        </Box>
                    </div>
                </Container>
            </ClickAwayListener>
        </Drawer>
    )
}
