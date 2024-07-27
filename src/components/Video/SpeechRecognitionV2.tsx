import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import SiriWave from 'react-siriwave';
import './SpeechRecognition.css'; // Import your custom CSS if needed

interface SpeechRecognitionProps {
    onCommand: (command: string) => void;
}

const SpeechRecognitionComponent: React.FC<SpeechRecognitionProps> = ({ onCommand }) => {
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [checkGuyTube, setCheckGuyTube] = useState(true);

    useEffect(() => {
        if (!browserSupportsSpeechRecognition) {
            console.error('Browser does not support speech recognition.');
            return;
        }

        console.log('Listening:', listening);
        if (!listening && transcript) {
            console.log('Transcript:', transcript); // Log the transcript
            sendTextToBackend(transcript);
            resetTranscript();
        }
    }, [listening, transcript, browserSupportsSpeechRecognition]);

    const sendTextToBackend = async (text: string) => {
        try {
            console.log('Sending text to backend...');
            const endpoint = 'http://localhost:8002/get_command';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            console.log('Received response from backend');
            const responseData = await response.json();

            if (checkGuyTube) {
                if (responseData === "hi_guide_tube") {
                    onCommand("stop");
                    speak("What do you need me to do?");
                    setCheckGuyTube(false);
                }
            } else {
                if (responseData !== "") {
                    onCommand(responseData.command);
                    setCheckGuyTube(true);
                } else {
                    speak("Sorry, I didn't understand what you need me to do");
                }
            }
        } catch (error) {
            console.error('Error sending text to backend:', error);
        }
    };

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => {
            SpeechRecognition.stopListening();
        };
        utterance.onend = () => {
            SpeechRecognition.startListening({ continuous: true });
        };
        speechSynthesis.speak(utterance);
    };

    const startListening = () => SpeechRecognition.startListening({ continuous: true });
    const stopListening = () => SpeechRecognition.stopListening();

    useEffect(() => {
        console.log('Starting to listen');
        startListening();
        return () => {
            console.log('Stopping listening');
            stopListening();
        };
    }, []);

    return (
        <div>
            {!checkGuyTube && (
                <div className="dark-overlay">
                    <div className="listening-overlay">
                        <div className="siri-wave-container">
                            <SiriWave
                                width={100}
                                height={100}
                                amplitude={1}
                                speed={0.12}
                                frequency={6}
                                color="#000000"
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className="status-indicator">
                {listening ? (
                    <p>Listening...</p>
                ) : (
                    <p>Not listening</p>
                )}
            </div>
        </div>
    );
};

export default SpeechRecognitionComponent;
