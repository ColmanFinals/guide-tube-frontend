import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import SiriWave from 'react-siriwave';
import {Box, Typography} from '@mui/material';
import { useUser } from '../../context/user-context';
import { Language } from '../../interfaces/ELanguage';

interface SpeechRecognitionProps {
    onCommand: (command: string) => void;
}

const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({onCommand}) => {
    const mediaRecorderRef: MutableRefObject<MediaRecorder | null> = useRef(null);
    const audioChunksRef: MutableRefObject<Blob[]> = useRef([]);
    const intervalIdRef: MutableRefObject<NodeJS.Timeout | null> = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [checkGuideTube, setCheckGuideTube] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const {user} = useUser();

    useEffect(() => {
        const startListening = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({audio: true});
                mediaRecorderRef.current = new MediaRecorder(stream);

                mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorderRef.current.onstop = async () => {
                    if (audioChunksRef.current.length > 0 && !isUploading) {
                        const audioBlob = new Blob(audioChunksRef.current, {type: 'audio/webm'});
                        audioChunksRef.current = [];
                        setIsUploading(true);
                        await sendAudioToBackend(audioBlob);
                        setIsUploading(false);
                    }
                };

                const startRecording = () => {
                    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'recording') {
                        mediaRecorderRef.current.start();
                        setIsRecording(true);
                    }
                };

                const stopRecording = () => {
                    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                        mediaRecorderRef.current.stop();
                        setIsRecording(false);
                    }
                };

                setTimeout(() => {
                    intervalIdRef.current = setInterval(() => {
                        if (!isUploading) {
                            stopRecording();
                        }
                        }, checkGuideTube ? 4000 : 6000);
                }, 1000);

                startRecording();
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        };

        startListening();

        return () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [isUploading, checkGuideTube]); // Add checkGuyTube to dependencies to reset interval when it changes

    const sendAudioToBackend = async (audioBlob: Blob) => {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');

        try {
            const language = user?.language ? user?.language : Language.ENGLISH;
            const endpoint = checkGuideTube ? `https://guidetube-ai.cs.colman.ac.il/${language}/hi_guide_tube` : `https://guidetube-ai.cs.colman.ac.il/${language}/transcribe`;
            const response = await fetch(endpoint, {
                method: 'PUT',
                body: formData,
            });

            
            const responseData = await response.json();

            if (checkGuideTube) {
                if (responseData) {
                    onCommand("stop");
                    speak("What do you need me to do?");
                    setCheckGuideTube(false);
                }
            } else {
                onCommand(responseData);
                setCheckGuideTube(true);
            }
        } catch (error) {
            console.error('Error sending audio to backend:', error);
        }
    };

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
                setIsRecording(false);
            }
        };
        utterance.onend = () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'recording') {
                mediaRecorderRef.current.start();
                setIsRecording(true);
            }
        };
        speechSynthesis.speak(utterance);
    };

    return (
        <>
            {!checkGuideTube && (
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    zIndex: 1200,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Box sx={{textAlign: 'center'}}>
                        <SiriWave
                            width={100}
                            height={100}
                            amplitude={1}
                            speed={0.12}
                            frequency={6}
                            color="#ffffff"
                        />
                        <Typography variant="h6" color="white" sx={{marginTop: 2}}>Listening...</Typography>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default SpeechRecognition;
