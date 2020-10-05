import React, { useState } from 'react'
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, Container, TableBody, Avatar, Button, TableFooter, TablePagination, ButtonGroup } from '@material-ui/core'
import { routes, checkStatus, catchAsync } from '../utils'
import Rating from '@material-ui/lab/Rating'
import EditIcon from '@material-ui/icons/Edit';
import { updateProductState, dashboardRouteState } from '../recoil/atoms';
import { useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import { deleteProduct, getProducts } from '../request/product.request';
import Hide from '../molecules/Hide.mole';
import LazySkeleton from './LazySkeleton.component';
import DeleteIcon from '@material-ui/icons/Delete';
import { useIsAdmin } from '../customHooks';


export default function ViewProducts() {

    const setProduct = useSetRecoilState(updateProductState);
    const setRoute = useSetRecoilState(dashboardRouteState);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [total, setTotal] = useState(-1);
    const isAdmin = useIsAdmin();

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        fetchData()
    }, [page, rowsPerPage])



    const fetchData = catchAsync(async () => {
        setLoading(true)
        const response = await getProducts(`?page=${page}&limit=${rowsPerPage}`);
        if (checkStatus(response)) {
            setProducts(response.data.products)
            setTotal(response.data.total)
        }
        setLoading(false)
    })

    const handleEdit = (product) => {
        setProduct({ ...product, productImage: product.image.original.map(i => ({ src: i })) });
        setRoute(routes.EDIT_PRODUCT);
    }

    const handleRowsPerPAge = event => {
        setRowsPerPage(event.target.value)
        setPage(1);
    }

    const handleDeleteProduct = catchAsync(async(id)=>{
        const response = await deleteProduct(id);
        setProducts(products.filter(item=>item._id !== id))
    })

    return (
        <div>
            <Box my={2}>
                <Typography variant="h4" align="center">
                    View Products
                </Typography>
                <Container maxWidth="md">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell align="right">View</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <Hide hide={loading} fallback={
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <LazySkeleton breakPoints={{ xs: 12 }} items={rowsPerPage} height={50} />
                                        </TableCell>
                                    </TableRow>
                                }>
                                    {products.map((item) => (
                                        <TableRow key={item.key}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>
                                                <Avatar variant="square" src={item.image.small[0]} />
                                            </TableCell>
                                            <TableCell>{item.price}</TableCell>
                                            {/* <TableCell>
                                                <Rating
                                                    value={item.totalStar / item.totalReview}
                                                    precision={0.5}
                                                    readOnly
                                                    size="small"
                                                />
                                            </TableCell> */}
                                            <TableCell align="right">
                                                <ButtonGroup>
                                                    <Button onClick={() => handleEdit(item)} startIcon={
                                                        <EditIcon />
                                                    } variant="outlined">
                                                        Edit
                                                    </Button>
                                                    <Hide hide={!isAdmin}>
                                                        <Button onClick={()=>handleDeleteProduct(item._id)} variant="outlined">
                                                            <DeleteIcon/>
                                                        </Button>
                                                    </Hide>
                                                </ButtonGroup>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </Hide>
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 15]}
                                        rowsPerPage={rowsPerPage}
                                        page={page - 1}
                                        onChangePage={(_, nxt) => setPage(nxt + 1)}
                                        onChangeRowsPerPage={handleRowsPerPAge}
                                        count={total}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>

                </Container>
            </Box>
        </div>
    )
}
