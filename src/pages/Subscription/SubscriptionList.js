import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
// import axios from '../../../node_modules/axios/index';
import CircularProgress from '@mui/material/CircularProgress';
 import Box from '@mui/material/Box';
//  import DeleteIcon from '@mui/icons-material/Delete';
//  import EditIcon from '@mui/icons-material/Edit';
// import { TextField } from '../../../node_modules/@mui/material/index';
 
//  import {  Button } from '@mui/material';

import React  , {useEffect}   from 'react';




import Swal from 'sweetalert2';
// import { API_URL } from 'Services/Service';
// import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import WithAuth from 'components/WithAuth';

const columns = [
    {
        id: '',
        label: 'Sr.No',
        minWidth: 10,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
      },
 
  {
    id: 'packageName',
    label: 'Package Name',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  // {
  //   id: 'duration',
  //   label: 'Duration',
  //   minWidth: 170,
  //   align: 'center',
  //   format: (value) => value.toLocaleString('en-US'),
  // },
  {
    id: 'monthly',
    label: 'Monthly',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toFixed(2),
  },

  {
    id: 'yearly',
    label: 'Yearly',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toFixed(2),
  },
  // {
  //   id: ' ',
  //   label: 'Action',
  //   minWidth: 170,
  //   align: 'center',
  //   format: (value) => value.toFixed(2),
  // },
];


// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(timer);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };




function SubscriptionList() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [ subscriptionList , setSubscriptionList ] = React.useState([]);
    const [loading,setLoading] = React.useState(false);
    const [count,setCount]=React.useState(0);
    // const [search, setSearch] = useState('');
    //  const debouncedSearch = useDebounce(search, 1000)
    //  const navigate= useNavigate()






    // const Navigate = useNavigate()
    
    
  // const handleSearchQueryChange = (event) => {
  //   setSearch(event.target.value);
  // };
    const fetchUserList = async (searchQuery) => {
        try {
          setLoading(true);
          // const response = await axios.post(
          //   'error/api/subscription/pagination',
          //   {
          //     curPage: page + 1,
          //     perPage: rowsPerPage,
          //     sortBy: 'createdAt',
          //     direction: 'desc',
          //     whereClause: [
          //       {
          //         key: 'all',
          //         value: searchQuery,
          //         operator: 'string',
          //       },
          //     ],
          //   },
          //   { headers: { 'authorization': `bearer ${localStorage.getItem("token")}` } }
          // );
    
          const { data } = response.data;
    
          
            setSubscriptionList(data)
          setCount(response.data.count)
          setLoading(false);
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
          setLoading(false);
          // Navigate('/login'); // Consider whether you want to redirect to login on error or not.
        }
      };
    
      useEffect(() => {
        // Check if the user is not logged in
        
        fetchUserList();
      }, [page, rowsPerPage])
    
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    
    // const handleClick =()=>{
    //   window.location.href = '/admin/createSubscription';

    // }
    // const deleteSubscription = async (id)=>{
    //   try{
    //    setLoading(true);
       
    //    let data = await axios.get(`${API_URL}/subscription/delete/${id}`,
    //    { headers: { 'authorization': `bearer ${localStorage.getItem("token")}` } })
    //    let resposne = data.data
    //    if(resposne.statusCode == 200){
    //     fetchUserList();
    //      Swal.fire(
    //        'success',
    //        'Subscription Deleted Successfully',
    //        'success'
    //      )
    //    }
    //    setLoading(false);
    //   } catch(err){
       
    //    Swal.fire(
    //      'error',
    //      'something went wrong',
    //      'error'
    //    )
    //   }
    //  }

    // const updateSubsciption= async (id)=> {
     
    //   navigate("/updateSubscription/" + id)
     
    
    // }


    
    if(loading){
         return<Box  sx= {{display: 'flex', justifyContent: 'center' ,  alignItems: 'center',  height: '80vh' }} 
         >
      <CircularProgress />
     </Box> }   
      





      return (
      <>
      {/* <stack  spacing={2} direction="row" style={{marginBottom: 15,display:"flex",justifyContent: 'flex-end' }} >
        <Button variant="contained" onClick={handleClick} >Create subscription</Button>
        <Box sx={{ }}>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
         value={search}
        onChange={handleSearchQueryChange}
        />
        </Box>


      </stack> */}
    
     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {subscriptionList.length>0?(<>
      
        <TableContainer >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
            <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptionList.map((row , index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                        <TableCell  align={"center"}>
                           {index+1}
                           </TableCell>
                                        <TableCell  align={"center"}>
                           {row.packageName}
                           </TableCell>
                      {/* <TableCell  align={"center"}>
                           {row.duration? row.duration:" null "}
                           </TableCell> */}
                           <TableCell  align={"center"}>
                           {row.monthly == 0?" Not Exist":row.monthly}
                           </TableCell>

                      <TableCell  align={"center"}>
                           {row.yearly == 0 ? "Not Exist " : row.yearly }
                           </TableCell>


                           {/* <TableCell  align={"center"}>
                            <Button onClick={() => updateSubsciption(row.id)}   ><EditIcon/></Button>    
                            <Button  onClick={()=>{deleteSubscription(row.id)}} ><DeleteIcon/></Button>    
                            </TableCell> */}

                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5,10,50,100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>):( <p style={{ display: 'flex', justifyContent: 'center'  }}>Record not found</p>)}
            
       
      </Paper></>)
}

export default WithAuth(SubscriptionList)