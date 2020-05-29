import React, { useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast, Box, Grid, Tag, TagLabel, TagCloseButton } from "@chakra-ui/core";
import Axios from 'axios';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    marginBottom: '1em',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#636363',
    borderStyle: 'dashed',
    backgroundColor: '#f0f0f0',
    color: '#262626',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

function FileUpload(props) {
    const toast = useToast();

    const [Files, setFiles] = useState([]);
    const [Filenames, setFilenames] = useState([]);

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0]);
        Axios.post('/api/beat/uploadFile', formData, config)
            .then(response => {
                if (response.data.success) {
                    console.log(response);
                    setFilenames([...Filenames, response.data.file.name])
                    props.refreshFunction([...Files, response.data.file.location])
                    toast({
                        position: "bottom",
                        title: "File uploaded.",
                        description: "Beat file successfully uploaded.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    })
                } else {
                    toast({
                        position: "bottom",
                        title: "Error uploading file.",
                        description: "Check the file type.",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    })
                }
            });
    }

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({ onDrop, accept: props.accept });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragAccept,
        isDragReject
    ]);

    const onDelete = (file) => {
        const currentIndex = Files.indexOf(file)
        let newFiles = [...Files]
        newFiles.splice(currentIndex, 1)
        setFiles(newFiles)
        props.refreshFunction(newFiles)
        toast({
            position: "bottom",
            render: () => (
                <Box m={3} color="white" p={3} bg="blue.500">
                    File removed.
                </Box>
            )
        })
    }

    return (
        <Box>
            <Grid templateColumns="repeat(2, 1fr)">
                <div className="container">
                    <div {...getRootProps({ style })}>
                        <input {...getInputProps()} />
                        <p>Drag your file here, or click to select.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {Filenames.map((file, index) => (
                        <div key={index} style={{ marginLeft: 'auto', marginBottom: '3px' }}>
                            <Tag
                                size="md"
                                key={index}
                                variant="solid"
                                variantColor="blue"
                            >
                                <TagLabel>{file}</TagLabel>
                                <TagCloseButton onClick={onDelete} />
                            </Tag>
                        </div>
                    ))}
                </div>
            </Grid>
        </Box>
    )
}

export default FileUpload
