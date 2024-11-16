import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImageLoader = () => {
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace 'YOUR_JWT_TOKEN' with the actual JWT token from your auth system
  const jwtToken = 'YOUR_JWT_TOKEN';

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/v1/user_images', {
          headers: {
            'token': `${localStorage.getItem('token')}`
          },
        });
        console.log(response.data)
        setImageData(response.data);
      } catch (error) {
        console.error("Error fetching image:", error);
        setError('Failed to load image');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  if (loading) return <p>Loading image...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex justify-center items-center p-6">
      {imageData.length!=0 ? (
         <>
         {imageData.map((image, index) => (
            <img
              key={index}
              src={`data:image/jpeg;base64,${image.data}`} // Use `image.url` if it's an object with a URL property
              alt={`Image ${index + 1}`}
              className="w-48 h-auto object-cover rounded-lg cursor-pointer"
            />
          ))}
         </>
      ) : (
        <p>No image data available</p>
      )}
    </div>
  );
};

export default ImageLoader;
