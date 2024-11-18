'use client'
import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from 'next/navigation'
import LoginButton from "@/components/Misc/LoginButton"
import TextInterface from "../TextInterface/TextInterface"

export default function Content() {
    const [hasToken, setHasToken] = useState<boolean>(false)

    function getCookie(key: string) {
        var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
        return b ? b.pop() : "";
    }

    function isCookieTimeWithinOneHour(): boolean {
        // Get the `current_time` cookie value
        const cookieValue = getCookie('current_time');

        // Check if the cookie exists
        if (!cookieValue) return false;

        // Parse the stored timestamp from the cookie as a number
        const storedTime = parseInt(cookieValue, 10);
        const currentTime = Date.now();

        // Calculate the difference in milliseconds
        const timeDifference = currentTime - storedTime;

        // Check if the time difference is less than 1 hour (3600000 milliseconds)
        return timeDifference < 3600000;
    }

    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // const accessCookie = getCookie('access_token')
        console.log("fired")
        console.log(isCookieTimeWithinOneHour())
        if (isCookieTimeWithinOneHour()) {
            setHasToken(true)
        }
    }, [pathname, searchParams]);

    return (
        <div className="w-full overflow-auto">
            {hasToken ? <TextInterface /> : <LoginButton />}
        </div>
    )
}

