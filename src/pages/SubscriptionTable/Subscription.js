
import React  , {useEffect,useState}   from 'react';
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
 import { TextField } from '../../../node_modules/@mui/material/index';
 


import Swal from 'sweetalert2';
import WithAuth from 'components/WithAuth';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../SubscriptionTable/Sub.css";

///import { DatePicker, DateRangePicker, LocalizationProvider } from '../../../node_modules/@mui/lab/index';




// import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';

const columns = [

  {  label: 'Name', minWidth: 150 },

  {
    id: 'email',
    label: 'Email',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },


    {
      id: 'amount',
      label: 'Amount',
      minWidth: 150,
      align: 'center',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'isYearly',
      label: 'IsYearly',
      minWidth: 120,
      align: 'center',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'subscriptionDate',
      label: 'Subscription Date',
      minWidth: 150,
      align: 'center',
      format: (value) => value.toLocaleString('en-US'),
    },

    {
        id: 'expiryDate',
        label: 'Expiry Date',
        minWidth: 150,
        align: 'center',
        format: (value) => value.toLocaleString('en-US')  ,
    }
  ];

  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      return () => {
        clearTimeout(timer);
      };
    }, [value, delay]);
  
    return debouncedValue;
  };

function Subscription() {
const [page, setPage] = React.useState(0);
const [rowsPerPage, setRowsPerPage] = React.useState(10);
const [ subscriptionList , setSubscriptionList ] = React.useState([]);
const [loading,setLoading] = React.useState(false)
const [count,setCount]  = React.useState(0)
const [search, setSearch] = useState('');
const [filter,setFilter] = useState([])
const debouncedSearch = useDebounce(search, 1000);

const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);
// const [isFetch,setIsFetch] = useState(false)


const onChange = (dates) => {
  const [start, end] = dates;
  setStartDate(start);
  setEndDate(end);
  let dateRangeFilter = [];
  if(start && end){
    dateRangeFilter = [
      {
        "key":"startDate",
        "value": start,
      },
      {
        "key":"endDate",
        "value":addtractOneDay(end),
      }
    ]
    setFilter([...filter,...dateRangeFilter])
  }else{
    if(!start && !end){
      setFilter((prev)=> {
        const copy = [...prev];
        copy.map((i) => {
            if(i.key == "startDate" || i.key  == "endDate"){
               i.value = ""
            }
        })
        return copy
     })
    }
   
  }
    // if(start && end){
    //     setIsFetch(true)
    // }else{
    //    setIsFetch(false)
    // }
  
 
// Debounce the search query with a delay of 500ms
}

const handleSearchQueryChange = (event) => {
  setSearch(event.target.value);
};

const formatUserName =(user) => {
   return user?.firstName + " " + user?.lastName
}



// const Navigate = useNavigate()

const fetchUserList = async (search) => {
    try {
      setLoading(true);
      // const response = await axios.post(
      //   'https://machanicalcalculator.microlent.com/api/user-subscription/pagination',
      //   {
      //     curPage: page + 1,
      //     perPage: rowsPerPage,
      //     sortBy: 'createdAt',
      //     direction: 'desc',
      //     // whereClause: [
      //     //   {
      //     //     key: 'all',
      //     //     value: searchQuery,
      //     //     operator: 'string'
      //     //   },
      //     //   {
      //     //     key: 'startDate',
      //     //     value: startDate ?? "",
      //     //     operator: 'string'
      //     //   },
      //     //   {
      //     //     key: 'endDate',
      //     //     value:  endDate ?addtractOneDay(endDate):  "",
      //     //     operator: 'string'
      //     //   }
            
      //     // ]
      //     whereClause:[...filter,{"key":"all","value":search}]
      //   },
        
        // { headers: { 'authorization': `bearer ${localStorage.getItem("token")}` } }
      // );

      const { data} = response.data;
      setCount(response.data.count)
    setSubscriptionList(data)
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
    fetchUserList(debouncedSearch);
  }, [page, rowsPerPage, debouncedSearch,filter]);






  function addtractOneDay(date) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  }



  // useEffect(() => {
  //      if(isFetch){
  //       fetchUserList()
  //      }
  // },[isFetch])




const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(+event.target.value);
  setPage(0);
};


if(loading){
     return<Box  sx= {{display: 'flex', justifyContent: 'center' ,  alignItems: 'center',  height: '80vh' }} 
     >
  <CircularProgress />
 </Box> }







  return (
    <div>
      
 <Box sx={{display:"flex" ,justifyContent:"flex-end", marginBottom: 2 }}>
 <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearchQueryChange}
        />
    <Box >
  <DatePicker
    
     customInput={<TextField
     sx={{fontsize: "16px"}}
     
      id="outlined-basic"
       variant="outlined"
       label="Select Subscription Date"
    />}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      showIcon
      selectsRange
      autoComplete="off"
      
       />

      </Box>
        </Box>
   
    
 <Paper sx={{ width: '100%', overflow: 'hidden' }}>
  {subscriptionList.length>0?(
  <>
       
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
          {subscriptionList.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                   <TableCell  align={"start"}>
                       {formatUserName(row?.user)}
                       </TableCell>
                   <TableCell  align={"center"}>
                       {row?.user?.email}
                       </TableCell>
                  <TableCell  align={"center"}>
                       {row.amount}
                       </TableCell>
                  <TableCell  align={"center"}>
                       {row.isYearly?"Yes":"No"}
                       </TableCell>
                  <TableCell  align={"center"}>
                       {row.subscriptionDate?new Date(row.subscriptionDate).toLocaleDateString():"-"}
                       </TableCell>
                  <TableCell  align={"center"}>
                       {row.expiryDate? new Date(row.expiryDate).toLocaleDateString():"-"}
                       </TableCell>
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
  </> ):( <p style={{ display: 'flex', justifyContent: 'center' }}>Record not found</p>
)}
   
  
  </Paper></div>)
}

export default WithAuth(Subscription)

