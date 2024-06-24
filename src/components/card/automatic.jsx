import React from 'react';
import axios from 'axios'; // Import Axios
import kidney from '../../assets/kidney.nii.gz';

const AutomaticFileUpload = () => {
    const uploadFile = async () => {
        const formData = new FormData();
        formData.append('file', kidney); // Assuming kidney is your file object

        try {
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                console.log('File uploaded successfully');
            } else {
                console.error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <button onClick={uploadFile}>Upload</button>
        </div>
    );
};

export default AutomaticFileUpload;
