import React, { useState } from 'react';
import axios from 'axios';
import ImageLoader from './ImageLoader';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [showImages , setShowImages] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post('http://localhost:5000/v1/add_data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': `${localStorage.getItem('token')}`
        },
      });
      setUploadStatus('Upload successful!');
      console.log('Server Response:', response.data);
    } catch (error) {
      console.error('Upload Error:', error);
      setUploadStatus('Upload failed. Please try again.');
    }
  };

  return (
    <>
    {showImages?<>
    <ImageLoader></ImageLoader>
    </>:<div className="max-w-sm mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Image Uploader</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg mx-auto"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Upload
      </button>
      <button
        onClick={()=>{setShowImages(true)}}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Show Your Images
      </button>

      {uploadStatus && (
        <p className={`mt-2 text-sm ${uploadStatus.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
          {uploadStatus}
        </p>
      )}
    </div>}
    </>
  );
};

export default ImageUploader;
