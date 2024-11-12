import { Container, Typography, CircularProgress, Box  } from '@mui/material';

const WaitModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-95 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg relative">
            <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '100px' }}>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <CircularProgress size={60} />
                    <Typography variant="h6" style={{ marginTop: '20px' }}>
                        Waiting To Load
                    </Typography>
                </Box>
            </Container>
        </div>
      </div>
    );
  };
  
  export default WaitModal;
  