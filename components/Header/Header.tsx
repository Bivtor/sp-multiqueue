import styles from '@/components/Header/Header.module.css'

export default function Header() {
    return (
        <div className="flex flex-col gap-3 w-full p-5 pb-10">
            <div className="flex flex-row justify-between content-center"> {/* Top Box */}
                <div className=""> {/* Header left top box */}
                    {/* <Images rc='' /> */}
                    <h1 className="text-2xl font-bold">
                        MTQ
                    </h1>
                </div>

                <div> {/* Header right top box */}
                    <h1 className="text-2xl sm:text-lg font-bold hover:cursor-pointer">
                        <span className={styles.underlineEffect}>
                            {/* MTQ */}
                            {/* <span className={styles.letter} data-text="ul">M</span>
                            <span className={styles.letter} data-text="i">T</span>
                            <span className={styles.letter} data-text="ueue">Q</span> */}
                        </span>
                    </h1>
                </div>
            </div>


            <div className="flex flex-row justify-center pt-10 sm:pt-3"> {/* Bottom Box */}
                <div className='flex flex-col gap-2 items-center'>
                    <h1 className="sm:text-lg text-sm font-bold underline-offset-8 underline">
                        What if Spotify could queue
                    </h1>
                    <h1 className="sm:text-lg text-sm font-bold underline-offset-8 underline">
                        multiple songs for you??                    </h1>
                </div>
            </div>
        </div>
    )
}