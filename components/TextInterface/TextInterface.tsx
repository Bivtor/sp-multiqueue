"use client";

import { useState } from "react";
import OpenAI from "openai";
import Error from "next/error";

// const apk = process.env.OPENAI_API_KEY;
// console.log(apk)
// const openai = new OpenAI(
//     {
//         apiKey: apk
//     }
// );

export default function TextInterface() {
    const [inputText, setInputText] = useState("");
    const [responseText, setResponseText] = useState("");

    const handleFetch = async () => {
        try {
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
        <div className=" border border-red-400 flex flex-col h-96 ">
            <textarea
                className="resize-none p-2 outline-none"
                placeholder="Requests here..."
                rows={10}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            />
            <button className=" border border-blue-400" onClick={handleFetch}>Submit</button>
            <div className="overflow-scroll">
                <pre className="p-2 mt-4 ">{responseText}</pre>
            </div>
        </div>
    );
}
