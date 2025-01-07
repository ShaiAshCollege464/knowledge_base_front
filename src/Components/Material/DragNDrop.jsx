import React, {useCallback, useEffect, useState} from 'react';
import {
    Alert, Box,
    Button,
    Card,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    ListSubheader,
    Stack
} from "@mui/material";
import {useDropzone} from "react-dropzone";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import {deleteMaterialFiles, getMaterialFiles, uploadFiles} from "../../API/FilesAPI.jsx";
import {FILE_ERROR_CODE, SUCCESS_CODE} from "../../Utils/Constants.jsx";
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import CloudOffIcon from '@mui/icons-material/CloudOff';


function DragNDrop() {
    const SUCCESS = "success"
    const ERROR = "error"
    const MAX_FILES = 5;
    const [selectedFiles, setSelectedFiles] = useState([])
    const [cloudFiles, setCloudFiles] = useState([]);
    const [deleteFromCloud, setDeleteFromCloud] = useState([]);
    const [errorUploading, setErrorUploading] = useState("")
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [materialId, setMaterialId] = useState(location.pathname.split("/")[4]);

    async function handleGetMaterialFiles() {
        const response = await getMaterialFiles(materialId)
        setCloudFiles(response)


    }


    const handleUploadFiles = async () => {
        if (selectedFiles.length > 0) {
            const response = await uploadFiles(selectedFiles, materialId)
            if (response.status === SUCCESS_CODE) {
                setErrorUploading(SUCCESS)
                setSelectedFiles([])
                handleGetMaterialFiles()
            } else if (response.status === FILE_ERROR_CODE) {
                setErrorUploading(ERROR)
            }
        }

    }
    const handleDeleteFiles = async () => {
        if (deleteFromCloud.length > 0) {
            const response = await deleteMaterialFiles(materialId, deleteFromCloud)
            setErrorUploading(SUCCESS)
            setDeleteFromCloud([])
            handleGetMaterialFiles()
        }

    }

    useEffect(() => {
        handleGetMaterialFiles()

    }, []);

    const alertHandler = () => {
        if (errorUploading === ERROR) {
            return <Alert severity={ERROR}>Error uploading - File type maybe unsupported</Alert>
        } else if (errorUploading === SUCCESS) {
            return <Alert severity={SUCCESS}>File uploaded successfully</Alert>
        }

    }

    const onDrop = useCallback((acceptedFiles) => {
            setSelectedFiles(prevState => {
                const newFiles = [];
                const files = [...cloudFiles, ...prevState];
                acceptedFiles.forEach(acceptedFile => {
                    const alreadyExists = prevState.some(existingFile => {
                        return existingFile.path === acceptedFile.path;
                    });

                    if (!alreadyExists) {
                        if (newFiles.length + files.length < MAX_FILES) {
                            newFiles.push(acceptedFile);
                        }

                    }
                });
                const combinedFiles = [...prevState, ...newFiles];
                return combinedFiles
            })
        }, [selectedFiles, cloudFiles]
    );

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    return (

        <Card sx={{
            width: "100%",
            height: "60vh",
            marginTop: 2,
            minHeight: "100%",
            maxHeight: "100%",
            maxWidth: "100%",
            minWidth: "100%",

        }}
              elevation={6}>
            <Stack sx={{height: "100%"}} direction="row"
                   divider={<Divider orientation="vertical" flexItem sx={{margin: 2}}/>}
            >


                <Stack {...getRootProps()} sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "70%",
                    height: "100%",
                }}> <input type={"file"} {...getInputProps()} />

                    <FileUploadIcon sx={{
                        width: "30%",
                        height: "30%",
                    }}/>{isDragActive ? "drop files now" : "Click here to upload files"}
                    <Box sx={{mt: 5}}>
                        {alertHandler()}
                    </Box>
                </Stack>

                <Stack direction={"column"}
                       sx={{
                           width: "40%",
                           minWidth: "40%",
                           height: "100%",
                           alignItems: "center",
                           m: 0,

                       }}
                       divider={<Divider orientation="horizontal" flexItem sx={{margin: 2}}/>}
                >
                    <List sx={{
                        width: "100%",
                        minWidth: "100%",
                        overflowY: "auto",
                        overflowX: "hidden",
                        height: "100%",
                        '&::-webkit-scrollbar': {
                            width: '0.4em',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,.1)',
                        }
                    }}
                          subheader={<ListSubheader> File selected:
                              ({cloudFiles.length + selectedFiles.length}/{MAX_FILES})</ListSubheader>}>

                        {cloudFiles.length > 0 && cloudFiles.map((file, index) => {
                            return (
                                <ListItemButton
                                    key={file}>
                                    <IconButton

                                        key={index}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                        onClick={() => {
                                            setDeleteFromCloud(prevState => prevState.concat(file))
                                            setCloudFiles(prevState => prevState.filter(item => item !== file))
                                        }}
                                    >
                                        {hoveredIndex === index ?
                                            <CloudOffIcon sx={{'&:hover': {color: 'red'}}}/> : <CloudQueueIcon/>}
                                    </IconButton>


                                    <ListItemText> {file}</ListItemText>
                                </ListItemButton>
                            )
                        })}
                        {selectedFiles.map((file) => {
                            return (
                                <ListItemButton
                                    key={file.name}>
                                    <IconButton onClick={() => {
                                        setSelectedFiles(prevState => prevState.filter(item => {
                                            return item.path !== file.path
                                        }))
                                    }

                                    }>
                                        <DeleteIcon
                                            sx={{'&:hover': {color: 'red'}}}
                                        />
                                    </IconButton>
                                    <ListItemText primary={file.name} secondary={file.size +" bytes"}/>
                                </ListItemButton>
                            )
                        })}

                    </List>
                    <Button onClick={() => {
                        setErrorUploading(false)
                        handleDeleteFiles()
                        handleUploadFiles()
                    }}
                            variant={"contained"}
                            color={"success"}
                            sx={{width: "70%", m: 2}}
                            disabled={selectedFiles.length === 0 && deleteFromCloud.length === 0}
                    >
                        Upload files
                    </Button>
                </Stack>
            </Stack>

        </Card>
    );
}

export default DragNDrop;