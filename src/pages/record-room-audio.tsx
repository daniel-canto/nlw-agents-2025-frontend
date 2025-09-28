import { Button } from "@/components/ui/button";
import { Navigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";

// Verifica se o navegador possui suporte para a gravação
const isRecordingSupported =
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof window.MediaRecorder === 'function'

type RoomParams = {
    roomId: string
    }

export function RecordRoomAudio() {
    const params = useParams<RoomParams>()
    const [isRecording, setIsRecording] = useState(false)
    const recorder = useRef<MediaRecorder | null>(null)

    function stopRecording() {
        setIsRecording(false)

        if (recorder.current && recorder.current.state !== 'inactive') {
            recorder.current.stop()
        }
    }

    async function uploadAudio(audio: Blob) {
        const formData = new FormData()

        formData.append('file', audio, 'audio,webm')

        const response = await fetch(`http://localhost:3333/rooms/${params.roomId}/audio`, {
            method: 'POST',
            body: formData,
        })
        
        const result = await response.json()

        // biome-ignore lint/suspicious/noConsole: <dev>
        console.log(result)
    }

    async function startRecording() {
        if (!isRecordingSupported) {
            alert('O seu navegador não suporta gravação.')
            return 
        }

        setIsRecording(true)
        
        // Define cartacterísticas para a configuração do aúdio
        const audio = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44_100,
            },
        })

        // Define o tipo do arquivo e o número de bits
        recorder.current = new MediaRecorder(audio, {
            mimeType: 'audio/webm',
            audioBitsPerSecond: 64_000,
        })

        recorder.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                uploadAudio(event.data)
            }
        }
        
        recorder.current.onstart = () => {
            // biome-ignore lint/suspicious/noConsole: dev
            console.log('Gravação iniciada!')
        }

        recorder.current.onstop = () => {
            // biome-ignore lint/suspicious/noConsole: dev
            console.log('Gravação encerrada/pausada')
        }

        recorder.current.start()

    }

    if (!params.roomId) {
        return <Navigate replace to="/" />
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-3">
            {isRecording 
                ? ( <Button onClick={stopRecording}>Pausar Gravação</Button> )
                : ( <Button onClick={startRecording}>Gravar aúdio</Button> )
            }
            {isRecording ? <p>Gravando...</p> : <p>Pausado</p> }
        </div>
    )
}