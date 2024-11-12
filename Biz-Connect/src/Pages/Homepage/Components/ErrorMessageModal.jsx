import { Container, Typography, Button, Box  } from '@mui/material';

const ErrorMessageModal = ({
    ErrorMessage,
    closeErrorMessageModal,
  }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-95 flex justify-center items-center z-50">
        <div className="bg-red rounded-lg p-6 w-[400px] shadow-lg relative">


        <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '100px' }}>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          {ErrorMessage}
        </Typography>
        <Button
          variant="outlined"
          onClick={closeErrorMessageModal} 
          style={{ marginTop: '10px' }}
        >
          Close
        </Button>

        
      </Box>
      
    </Container>
        </div>
      </div>
    );
  };
  
  export default ErrorMessageModal;
  