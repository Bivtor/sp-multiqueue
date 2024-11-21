'use client'
export default function LoginButton() {

    const onClickHandler = () => {
        // if 
        window.location.href = "https://sp-multiqueue.vercel.app/login";
    }
    return (
        <button className="" onClick={() => { onClickHandler() }}>Login</button>
    )
}