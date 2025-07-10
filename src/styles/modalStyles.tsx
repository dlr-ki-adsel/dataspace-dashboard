export const getModalBoxStyle = (width = 400) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: width,
    maxHeight: "90vh",
    bgcolor: 'background.paper',
    borderRadius: 2,
    //boxShadow: 24,
    p: 4,
    overflow:'scroll',
    display:'block',
    border: '1 px solid white',
    // wight lighting shadow for modal box 
    boxShadow: '0px 0px 15px rgba(255, 255, 255, 0.8)', // white light shadow
    '&:hover': {
      boxShadow: '0px 0px 20px rgba(255, 255, 255, 1)', // increasing lighting by hover
    },
    transition: 'all 0.3s ease',

});
