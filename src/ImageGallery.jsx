import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { flushSync } from 'react-dom';
import Popup from './Popup';
import ImageUploader from './ImageUploader';

function ImageGallery() {
  const [images, setImages] = useState([]);
  const [questions , setQuestions] = useState(null)
  const [file_name , setFileName] = useState("")

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupTitle , setPopupTitle] = useState("")
  const [content , setPopupContent] = useState("")
  const [upload_data , setUploadData] = useState(false)

  const handleOpenPopup = () => setPopupOpen(true);
  const handleClosePopup = () => {
    setPopupOpen(false)
    setUploadData(true)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestions((prevData) => ({ ...prevData, [name]: value }));
  };
  // Function to fetch images from the API
  useEffect(() => {
    const fetchImages = async () => {
        try {
            const response = await axios.get('http://localhost:5000/v1/images', {});
            console.log(response.data)
            setImages(response.data);
          } catch (error) {
            console.error('Error submitting form:', error);
          }
    };

    fetchImages();
  }, []);

  const select_image = async (file_name) => {
    console.log(file_name)
    setFileName(file_name)
    const data = {
        'file_name' : file_name
    }
    try {
        const response = await axios.post('http://localhost:5000/v1/get_questions', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Response:', response.data);
        setQuestions(response.data.questions)
      } catch (error) {
        console.error('Error submitting form:', error);
      }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object
    let data = {
        answers : {},
        file_name : file_name
    };
    Object.entries(questions).forEach(([key, value]) => {
      data.answers[key] = value;
    });
    console.log(data)
    try {
      const response = await axios.post('http://localhost:5000/v1/login', data, {
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
      }
      else{
        setPopupTitle("Error")
        setPopupContent(<p>You May Have Entered Wrong Answers</p>)
        setPopupOpen(true)
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setPopupTitle("Error")
      setPopupContent(<div><p>Birthday Error</p><p>You may have entered wrong birthday.please try again</p></div>)
      setPopupOpen(true)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="max-w-lg w-full p-6 bg-white rounded-xl shadow-lg">
    <h2 className="text-2xl font-bold text-center mb-6">Login Using Encrypted Image</h2>

    {questions ? (
      <div>
        {upload_data?<div>
          <ImageUploader></ImageUploader>
        </div>:<div>
          <h3 className="text-lg font-semibold text-center mb-4">Submit Answers to These Questions</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text inputs for questions */}
          {Object.keys(questions).map((key) => (
            <div key={key}>
              <label className="block font-semibold text-gray-700 mb-1">{key}</label>
              <input
                type="text"
                name={key}
                value={questions[key]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 focus:ring-4 focus:ring-blue-400 focus:outline-none"
          >
            Login
          </button>
        </form>

        <Popup 
          isOpen={isPopupOpen} 
          title={popupTitle}
          content={content}  
          onClose={handleClosePopup}
        />
          </div>}
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-4 justify-items-center">
        {images.map((image, index) => (
          <img
            key={index}
            src={`data:image/jpeg;base64,${image.data}`} // Use `image.url` if it's an object with a URL property
            alt={`Image ${index + 1}`}
            className="w-48 h-auto object-cover rounded-lg cursor-pointer"
            onClick={() => select_image(image.fileName)}
          />
        ))}
      </div>
    )}
  </div>
</div>
  );
}

export default ImageGallery;
