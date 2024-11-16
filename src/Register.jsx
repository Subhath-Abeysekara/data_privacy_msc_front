import React, { useState } from 'react';
import axios from 'axios';
import Popup from './Popup';
import ImageList from './ImageList';
import ImageGallery from './ImageGallery';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    "what city were you born in?": '',
    "what is your oldest sibling’s middle name?": '',
    "what is your mother's name?": '',
    "what is the type of your first pet?": '',
    "who was your childhood hero?": '',
    "what was your childhood ambition?": '',
    "what is your birthday?": '',
  });
  const [image, setImage] = useState(null);

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle image file change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("Default Title");
  const [popupContent, setPopupContent] = useState(<p>Default Content</p>);
  const [nextPage , setNextPage] = useState(false) 

  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => {
    setPopupOpen(false);
    setNextPage(true)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (image) {
      data.append('image', image);
    }

    try {
      const response = await axios.post('http://localhost:5000/v1/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      if (response.data.state){
        setPopupTitle(response.data.message)
        setPopupContent(<div><p>Your Phrase : </p><p>{response.data.phrase}</p></div>)
        setPopupOpen(true)
      }
      else{
        setPopupTitle("Error")
        setPopupContent(<p>{response.data.message}</p>)
        setPopupOpen(true)
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setPopupTitle("Error")
      setPopupContent(<div><p>Somthing went wrong</p><p>You may have insert available image in the store.please try another image</p></div>)
      setPopupOpen(true)
    }
  };

  return (
    <>
    {!nextPage?<div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-lg w-full mx-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text inputs for questions */}
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block font-semibold text-gray-700 mb-1">{key}</label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
              />
            </div>
          ))}
  
          {/* File upload for image */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Upload Profile Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
            />
            {image && (
              <p className="text-sm text-gray-600 mt-2">Selected file: {image.name}</p>
            )}
          </div>
  
          {/* Submit button */}
          <button
    type="submit"
    className="w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 focus:ring-4 focus:ring-blue-400 focus:outline-none"
  >
    Register
  </button>
        </form>
        <button
    className="w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 focus:ring-4 focus:ring-blue-400 focus:outline-none"
    onClick={() => { setNextPage(true) }}
  >
    Login
  </button>
        <Popup 
          isOpen={isPopupOpen} 
          title={popupTitle}
          content={popupContent}  
          onClose={handleClosePopup}
        />
      </div>
    </div>:<>
    <ImageList></ImageList>
    </>}
    </>
  );
  
};

export default RegisterForm;



