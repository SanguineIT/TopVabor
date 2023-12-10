// apiErrorHandler.js
const handleApiError = async (response) => {
    if(response.statusCode != 200){
        
        throw new Error(response.message || 'Something went wrong.');
    }
    return false;
  };
  
  export default handleApiError;
  