import React, {useEffect, useState} from 'react';
import {
    Box,
    Card,
    Collapse,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Stack,
    Typography
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";
import {SERVER_URL} from "../../Utils/Constants.jsx";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import PropTypes from "prop-types";
import formatDatetime from "../../Utils/formatDatetime.jsx";

// DownloadFiles.propTypes = {
//     material: PropTypes.shape({
//         id: PropTypes.number.isRequired,
//         title: PropTypes.string.isRequired,
//         uploadDate: PropTypes.string.isRequired,
//         description: PropTypes.string.isRequired,
//
//         content: PropTypes.string.isRequired,
//         typeEntity: PropTypes.shape({
//             id: PropTypes.number.isRequired,
//             name: PropTypes.string.isRequired,
//         }).isRequired,
//
//         tagEntity: PropTypes.shape({
//             id: PropTypes.number.isRequired,
//             name: PropTypes.string.isRequired,
//         }).isRequired,
//     })
// }


function DownloadFiles(props) {
    const [materialId, setMaterialId] = useState(location.pathname.split("/")[4]);
    const [groupedFiles, setGroupedFiles] = useState([])
    const [open, setOpen] = React.useState({});
    const handleClick = (uploader) => {
        setOpen({
            ...open,
            [uploader]: !open[uploader],
        });
    };

    useEffect(() => {
        getMaterialFilesName()
    }, []);

    function getMaterialFilesName() {
        axios.get(SERVER_URL + "/get-material-file-by-id?id=" + materialId).then(
            response => {
                if (response != null) {
                    setGroupedFiles(groupFilesByUploader(response.data))
                }
            }
        )
    }

    function downloadFile(fileId){
        setTimeout(() => {
            const response = {
                file: encodeURI("http://localhost:8080/download-file?id="+fileId)
            };
            window.open(response.file);
        }, 10);
    }
    const groupFilesByUploader = (files) => {
        return files.reduce((files, file) => {
            files[file.uploadedBy] = files[file.uploadedBy] || [];
            files[file.uploadedBy].push(file);
            return files;
        }, {});
    };

    return (
        <Card sx={{
            width: "100%",
            height: "60vh",
            marginTop: 2,
            padding: 2,
            minHeight: "100%",
            maxHeight: "100%",
            maxWidth: "100%",
            minWidth: "100%",
        }}
              elevation={6}>
            <Stack sx={{height: "100%"}} direction="row"
                   divider={<Divider orientation="vertical" flexItem sx={{margin: 2}}/>}
            >
                <Box sx={{width: "50%"}}>
                    <Typography variant='h4' sx={{textAlign: "center"}}>
                        {props.material.title}
                    </Typography>
                    <Typography variant='h6' sx={{textAlign: "center"}}>
                        {formatDatetime(props.material.uploadDate)}
                    </Typography>
                    <Typography sx={{ mt: 2 ,textAlign: "center"}}>
                        {props.material.content}
                    </Typography>
                    <Typography sx={{ mt: 2 ,textAlign: "center"}}>
                        {props.material.description}
                    </Typography>
                </Box>
                <List sx={{
                    height: "100%",
                    width: "50%",
                    overflowY: "auto",
                    overflowX: "hidden",
                    '&::-webkit-scrollbar': {
                        width: '0.4em',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,.1)',
                    }
                }}
                      subheader={<Typography>Download Files:</Typography>}
                      dense={false}
                >

                    {Object.keys(groupedFiles).map((uploader) => (
                        <Box key={uploader}>

                            <ListSubheader sx={{display: 'flex', alignItems: 'center'}}
                                           onClick={() => handleClick(uploader)}
                            >
                                <Typography marginRight={2} variant="subtitle1">{uploader}</Typography>
                                <Typography variant="subtitle4"> {groupedFiles[uploader].length} file</Typography>
                                {open[uploader] ? <ExpandLess/> : <ExpandMore/>}
                            </ListSubheader>
                            <Collapse in={open[uploader]} timeout="auto" unmountOnExit>
                                {groupedFiles[uploader].map((file, index) => (
                                    <ListItemButton dense={true} key={index}>

                                        <ListItemIcon>
                                            <IconButton onClick={()=>{downloadFile(file.fileId)}}>
                                                <DownloadIcon sx={{'&:hover': {color: 'green'}}}/>
                                            </IconButton>
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={file.fileName}
                                            secondary={file.fileSize + " bytes"}
                                        />
                                    </ListItemButton>

                                ))}
                            </Collapse>
                            <Divider/>
                        </Box>
                    ))}
                </List>

            </Stack>
        </Card>
    );
}

export default DownloadFiles;