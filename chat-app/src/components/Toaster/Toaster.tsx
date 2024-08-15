// React toastify
import { Slide, ToastContainer } from 'react-toastify';

// Styles
import 'react-toastify/dist/ReactToastify.css';

const Toaster = () => {
  return (
    <>
      <ToastContainer
        toastStyle={{
          backgroundColor: '#f0f0f0',
        }}
        theme="light"
        transition={Slide}
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Toaster;