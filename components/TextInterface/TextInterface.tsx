"use client";
import { useState } from "react";
import Error from "next/error";
import { isCookieTimeWithinOneHour } from "../Home/Content";
import { useRouter } from 'next/navigation'

// const apk = process.env.OPENAI_API_KEY;
// console.log(apk)
// const openai = new OpenAI(
//     {
//         apiKey: apk
//     }
// );

interface TextInterfaceProps {
    setHasToken: (value: boolean) => void;
}

export default function TextInterface({ setHasToken }: TextInterfaceProps) {
    const [inputText, setInputText] = useState("");
    const [responseText, setResponseText] = useState("");
    const [isButtonActive, setIsButtonActive] = useState(false);
    const router = useRouter();

    const handleFetch = async () => {
        try {
            // Redirect to / if cookie is old
            if (!isCookieTimeWithinOneHour()) {
                setHasToken(false)
                router.replace('/'); // Replaces the current route with '/', refreshing the page
                return; // Exit early to prevent further execution
            }

            // Simulate fetching or action
            setResponseText(`Processing: ${inputText}`);
            setIsButtonActive(true);

            // Reset after 3 seconds
            setTimeout(() => {
                setIsButtonActive(false);
                setInputText(""); // Clear textarea
            }, 5000);


            const response = await fetch(`/completion?text=${encodeURIComponent(inputText)}`);
            const data = await response.json();

            if (response.ok) {
                setResponseText(data.response);
            } else {
                setResponseText(`Error: ${data.error}`);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setResponseText(`Error: ${error}`);
            } else {
                setResponseText(`Error: ${String(error)}`);
            }

        }
    };


    return (
        <div className="flex flex-col items-center w-3/4 h-full border border-black rounded-md overflow-hidden">
            <textarea
                className="resize-none p-2 outline-none rounded-md w-full "
                placeholder="Play John Mayer and queue 4 songs by Ashnikko..."
                rows={10}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            />
            <button
                className={`w-1/2 border border-blue-400 p-2 rounded-md ${isButtonActive ? "bg-blue-500 text-white" : ""}`}
                onClick={handleFetch}
            >
                Submit
            </button>
            <div className="flex flex-col items-center overflow-y-scroll h-20 w-full mt-4 text-sm">
                <pre className="p-2">{responseText}</pre>
            </div>
        </div>

    );
}
