'use client'
export default function LoginButton() {

    const onClickHandler = () => {
        // if 
        window.location.href = "http://localhost:3000/login";
    }
    return (
        <button className="" onClick={() => { onClickHandler() }}>Login</button>
    )
}