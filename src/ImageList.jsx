import React, { useState } from 'react';
import axios from 'axios';
import Popup from './Popup';
import ImageUploader from './ImageUploader';
import ImageGallery from './ImageGallery';

const ImageList = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupTitle , setPopupTitle] = useState("")
  const [content , setPopupContent] = useState("")
  const [upload_data , setUploadData] = useState(false)
  const [directLogin , setDirectLogin] = useState(true)
  const [login , setLogin] = useState(false)

  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => {
    setPopupOpen(false)
    if(login){
      setUploadData(true)
    }
  };;

  const handleSeedPhraseChange = (e) => {
    setSeedPhrase(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a simple JSON object for the request body
    const data = {
      phrase: seedPhrase
    };
  
    try {
      const response = await axios.post('http://localhost:5000/v1/direct_login', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response:', response.data);
      if (response.data.state){
        localStorage.setItem('token' , response.data.token)
        setPopupTitle("Successfully Loged In")
        setPopupContent(<div><p>You can access your data now</p></div>)
        setPopupOpen(true)
        setLogin(true)
      }
      else{
        setPopupTitle("Error")
        setPopupContent(<p>You May Have Entered Wrong Phrase</p>)
        setPopupOpen(true)
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setPopupTitle("Error")
      setPopupContent(<div><p>Phrase Error</p><p>You may have entered wrong phrase.please try again</p></div>)
      setPopupOpen(true)
    }
  };

  return (
    <>
    {directLogin?<>
    {upload_data?<div>
      <ImageUploader></ImageUploader>
    </div>:<div>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="max-w-lg w-full p-6 bg-white rounded-xl shadow-lg">
    <h1 className="text-2xl font-bold text-center mb-6">Direct Login with Seed Phrase</h1>

    {/* Seed Phrase Input */}
    <div className="mb-4">
      <label htmlFor="seedPhrase" className="block font-semibold text-gray-700 mb-2">
        Enter Seed Phrase:
      </label>
      <input
        type="text"
        id="seedPhrase"
        value={seedPhrase}
        onChange={handleSeedPhraseChange}
        placeholder="Enter your seed phrase"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
      />
    </div>

    {/* Display Seed Phrase */}
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Entered Seed Phrase:</h3>
      <p className="text-gray-600">{seedPhrase}</p>
    </div>

    {/* Submit Button */}
    <button
    type="submit"
    className="py-3 px-6 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 focus:ring-4 focus:ring-blue-400 focus:outline-none"
    onClick={handleSubmit}
  >
    Login
  </button>
  <button
    className="py-3 px-6 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 focus:ring-4 focus:ring-blue-400 focus:outline-none"
    onClick={() => setDirectLogin(false)}
  >
    Use Image
  </button>

    {/* Popup Component */}
    <Popup 
      isOpen={isPopupOpen} 
      title={popupTitle}
      content={content}  
      onClose={handleClosePopup}
    />
  </div>
</div>
      </div>}
    </>:
    <>
<ImageGallery></ImageGallery>
    </>}
    </>
  );
};

export default ImageList;
