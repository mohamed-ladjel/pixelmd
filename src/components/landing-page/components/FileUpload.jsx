// Import necessary dependencies
import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import "./FileUpload.css";
import FileIcon from '../assets/file.svg';
import UploadIcon from '../assets/upload.svg';
import CloseIcon from '../assets/close.svg';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const FileUpload = ({ onFileSelect }) => {
    const inputRef = useRef();
    const history = useHistory();

    const [selectedFile, setSelectedFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState("select");

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (uploadStatus === "done") {
            console.log(selectedFile.name, "yayaya")
            clearFileInput();
            onFileSelect(selectedFile);
            history.push('/vue', { file: selectedFile }); // Navigate to '/vue' with the uploaded file
            // window.location.reload(); // Refresh the page to re-render the new page
            return;
        }

        try {
            setUploadStatus("uploading");

            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axios.post('http://localhost:5000/upload', formData, {
                onUploadProgress: progressEvent => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setProgress(progress);
                }
            });

            console.log('File URL:', response.data.url);

            setUploadStatus("done");
            onFileSelect(selectedFile);
            history.push('/vue', { fileUrl: response.data.url }); // Pass the file URL to the '/vue' route
            console.log(selectedFile,"how",response.data.url)

            window.location.reload(); // Refresh the page to re-render the new page
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus("select");
        }
    };

    const clearFileInput = () => {
        inputRef.current.value = "";
        setSelectedFile(null);
        setProgress(0);
        setUploadStatus("select");
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            {/* Button to trigger the file input dialog */}
            {!selectedFile && (
                <button className="file-btn" onClick={onChooseFile}>
                    <span className="material-symbols-outlined">Drag & drop any image here </span>
                    <Typography
                        sx={{
                            fontSize: 'clamp(29px, 2vw, 18px)',
                            color: (theme) =>
                                theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                        }}
                    >
                        or
                        browse file from device

                    </Typography>
                </button>
            )}

            {selectedFile && (
                <>
                    <div className="file-card">
                        <span >
                            <div>
                                <img src={FileIcon} alt="Your SVG" />
                            </div>
                        </span>

                        <div className="file-info" style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <h6 style={{ marginBottom: 15 }}>{selectedFile ? (selectedFile.name.length > 150 ? `${selectedFile.name.slice(0, 150)}...` : selectedFile.name) : ''}</h6>
                                <div className="progress-bg">
                                    <div className="progress" style={{ width: `${progress}%` }} />
                                </div>
                            </div>

                            {uploadStatus === "select" || uploadStatus === "done" ? (
                                <button onClick={clearFileInput}>
                                    <span className="material-symbols-outlined close-icon">
                                        <div className="material-symbols-outlined close-icon" >
                                            <img src={CloseIcon} alt="Your SVG" />
                                        </div>
                                    </span>
                                </button>
                            ) : (
                                <div className="check-circle">
                                    {uploadStatus === "uploading" ? (
                                        `${progress}%`
                                    ) : uploadStatus === "done" ? (
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: "20px" }}
                                        >
                                            check
                                        </span>
                                    ) : null}
                                </div>
                            )}
                        </div>

                    </div>
                    <button className="upload-btn" onClick={handleUpload}>
                        <span className="text">
                            {uploadStatus === "select" || uploadStatus === 'uploading' ? "Upload" : "Done"}
                        </span>
                        <div >
                            <img src={UploadIcon} alt="Your SVG" />
                        </div>
                    </button>
                </>
            )}
        </div>
    );
};

export default FileUpload;
