import { useEffect } from 'react'
import io from "./socket"

export default function useSocket(eventName, cb) {
    useEffect(() => {
        io.getSocket().on(eventName, cb)
        return function useSocketCleanup() {
            io.getSocket().off(eventName, cb)
        }
    }, [eventName, cb])
}