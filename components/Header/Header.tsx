import Image from "next/image"

export default function Header() {
    return (
        <div className="flex flex-col gap-3 w-full p-5 ">
            <div className="flex flex-row justify-between content-center"> {/* Top Box */}
                <div className=""> {/* Header left top box */}
                    {/* <Images rc='' /> */}
                    <h1 className="text-2xl font-bold">
                        MTQ
                    </h1>
                </div>

                <div> {/* Header right top box */}
                    <h1 className="text-2xl font-bold hover:underline hover:cursor-pointer hover:decoration-secondary">
                        MTQ
                    </h1>
                </div>
            </div>

            {/* TODO I want to make this a dropdown with Trump & Biden as options */}

            <div className="flex flex-row justify-center"> {/* Bottom Box */}
                <div>
                    <h1 className="text-lg font-bold">
                        What if Spotify could queue multiple songs for you??
                    </h1>
                </div>
            </div>
        </div>
    )
}