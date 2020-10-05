import React from 'react'
import { Snackbar, Backdrop, CircularProgress } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import { useRecoilState } from 'recoil';
import { alertSnackbarState, loaderState } from '../recoil/atoms';
import Hide from '../molecules/Hide.mole';

export default function Defaults() {

    const [alertSnackbar, setAlertSnackbar] = useRecoilState(alertSnackbarState);
    const [loader] = useRecoilState(loaderState);

    const snackbarClose = () => {
        setAlertSnackbar({ ...alertSnackbar, open: false, message: '' })
    }

    return (
        <div>
            <Snackbar onClose={snackbarClose} open={alertSnackbar.open} autoHideDuration={alertSnackbar?.time || 3000}>
                <MuiAlert onClose={snackbarClose} elevation={6} variant="filled" severity={alertSnackbar?.severity || 'info'}>
                    {alertSnackbar.message}
                </MuiAlert>
            </Snackbar>
            <Hide hide={!loader}>
                <Backdrop style={{ zIndex: 15 }} open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Hide>
        </div>
    )
}
