'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, InputBase } from '@mui/material'
import { firestore, auth } from '../../firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import Head from 'next/head'
import Header from '../../components/Header.js'

import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const [user, setUser] = useState(null);


  const [isFirestoreReady, setIsFirestoreReady] = useState(false);

  useEffect(() => {
    if (firestore) {
      setIsFirestoreReady(true)
    }
    
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        loadUserPantry(currentUser.uid)
      } else {
        setInventory([])
      }
    })

    return () => unsubscribe()
  }, [])

  const loadUserPantry = async (userId) => {
    try {
      const snapshot = await getDocs(query(collection(firestore, `users/${userId}/inventory`)))
      const inventoryList = snapshot.docs.map(doc => ({ name: doc.id, ...doc.data() }))
      setInventory(inventoryList)
    } catch (error) {
      console.error("Error loading user's pantry:", error)
    }
  }

  const updateInventory = async (userId) => {
    if (!isFirestoreReady || !userId) return;

    const snapshot = query(collection(firestore, `users/${userId}/inventory`))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }


  const addItem = async (item) => {
    if (!isFirestoreReady || !user) return;

    const docRef = doc(collection(firestore, `users/${user.uid}/inventory`), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory(user.uid)
  }
  
  const removeItem = async (item) => {
    if (!isFirestoreReady || !user) return;

    const docRef = doc(collection(firestore, `users/${user.uid}/inventory`), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory(user.uid)
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Uses old methods of Material UI 
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

  return (
    <>
      <Head>
        <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/6.1.0/firebase-ui-auth.css" />
        <title>Inventory Management App</title>
        <meta name="description" content="An inventory management application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Box
        width="95vw"
        height="82vh"
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
        bgcolor={'#F0F4F8'}
        overflow="auto"
        padding={5}
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
        <TableContainer component={Paper} sx={{ width: '800px', maxHeight: '400px'}}>
          <Table stickyHeader aria-label="inventory table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="h4" color="#333" textAlign="left">
                    My Pantry
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map(({ name, quantity }) => (
                <TableRow key={name}>
                  <TableCell component="th" scope="row">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </TableCell>
                  <TableCell align="right">{quantity}</TableCell>
                  <TableCell align="right">
                    <Button variant="contained" onClick={() => removeItem(name)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box width="800px" display="flex" justifyContent="flex-start">
          <Button variant="contained" onClick={handleOpen}>
            Add New Item
          </Button>
        </Box>
      </Box>
    </>
  )
}