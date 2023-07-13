'use client'

import React, {useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import {Button, Grid, TextField} from '@mui/material';
import Completion from "@/components/Completion";
import {TextareaAutosize} from "@mui/base";
import {useChat} from 'ai/react'


export default function Chat() {
    const [nodeHeight, setNodeHeight] = useState(0);

    const {
        input,
        isLoading,
        handleInputChange,
        handleSubmit,
        messages,
        reload,
        setInput,
        stop
    } = useChat();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            readFileContent(event.target.files[0]).then(content => {
                setInput(input + " " + content);
                // Resetting the value allows to select the same file again
                event.target.value = '';
            }).catch(error => {
                // handle error
                console.error(error);
            });
        }
    };

    const readFileContent = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                resolve(event?.target?.result as string);
            };

            reader.onerror = (event) => {
                reject(new Error("Error reading file: " + event?.target?.error));
            };

            reader.readAsText(file);
        });
    };

    const textFieldRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (textFieldRef.current) {
            const inputElement = textFieldRef.current.querySelector('textarea');
            if (inputElement) {
                setTimeout(() => {
                    const { height } = window.getComputedStyle(inputElement);
                    setNodeHeight(parseFloat(height));
                }, 0);
            }
        }
    }, [input]);

    return (
        <Box sx={{
            height: '96vh',
            maxWidth: 700,
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: '#F0F0F0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            py: 1,
        }}>
            <Grid container spacing={2}>
                <Grid item xs={12} className="messageContainer">
                    <Box sx={{
                        border: '2px solid #ddd',
                        borderRadius: '5px',
                        p: 1,
                        maxHeight: `calc(94vh - ${Math.max(150, 127 + nodeHeight)}px)`,
                        overflowY: 'auto',
                        flex: 1, // This will allow it to expand and shrink
                        mb: 0, // Adding margin at the bottom
                    }}>
                        <Completion messages={messages} reload={reload}/>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={2} className="sendMessageContainer" sx={{position: 'fixed', bottom: 40, width: '715px'}}>
                <Grid item xs={12}>
                    <Box sx={{border: '2px solid #ddd', borderRadius: '5px', p: 1}}>
                        <TextField
                            ref={textFieldRef}
                            fullWidth
                            id="user-input"
                            label={"Send a message..."}
                            multiline
                            InputProps={{
                                inputComponent: TextareaAutosize,
                                inputProps: {
                                    minRows: 1,
                                    maxRows: 10,
                                    style: {resize: 'none'},
                                },
                            }}
                            value={input}
                            onChange={handleInputChange}
                            variant="outlined"
                            disabled={false}
                            sx={{borderRadius: '5px', backgroundColor: '#FAFAFA'}}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit as () => void}
                        fullWidth
                        disabled={false}
                    >
                        Send
                    </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                    <input
                        type="file"
                        id="file-input"
                        style={{display: 'none'}}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-input">
                        <Button
                            variant="outlined"
                            color="primary"
                            component="span"
                            style={{minWidth: "120px"}}>
                            Select File
                        </Button>
                    </label>
                </Grid>
                <Grid item xs={12} md={4} style={{display: "flex", justifyContent: "flex-end"}}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={stop as () => void}
                        disabled={!isLoading}
                        style={{minWidth: "120px"}}
                    >
                        Abort
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
