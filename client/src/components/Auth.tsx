import React, {useState} from "react";
import {useCookies} from "react-cookie";

const Auth = () => {
    const [cookies, setCookies, removeCookies] = useCookies()
    const [isLogIn, setLogin] = useState(true);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    console.log(email, password)
    const viewLogin = (status: boolean) => {
        setError("")
        setLogin(status)
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, endPoint: any) => {
        e.preventDefault();
        try {
            if (!isLogIn && password !== confirmPassword) {
                setError('Make sure password matches!')
                return
            }
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/${endPoint}`, {
                method: "POST",
                headers: {"Content-Type": 'application/json'},
                body: JSON.stringify({email, password})
            })
            let data = await response.json()
            console.log(data)
            if (data.detail) {
                setError(data.detail);
            } else {
                removeCookies('Email')
                removeCookies('AuthToken')
                setCookies('Email', String(data.email))
                setCookies('AuthToken', data.token)
            }

/*             window.location.reload();
 */        } catch (error) {
            console.error(error);
        }
    }
    return <div className="auth-container">
        <div className="auth-container-box">
            <form onSubmit={(e:React.FormEvent<HTMLFormElement>) => handleSubmit(e, isLogIn ? 'login' : 'sign-up')}>
                <h2 className="list-header">{isLogIn ? 'Please login' : 'Please Sign up'}</h2>
                <input type="text" name="email" placeholder="email"
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
                <input type="password" name="password" placeholder="password"
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                           setPassword(e.target.value)
                       }}/>
                {!isLogIn && <input type="password" name="confirm_password" placeholder="confirm password"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setConfirmPassword(e.target.value)
                                    }}
                />}
                <input type="submit" className="create"/>
                {error && <p>{error}</p>}
            </form>
            <div className="auth-options">
                <button
                    style={{backgroundColor: !isLogIn ? 'rgb(255,255,255)' : 'rgb(188,188,188)'}}
                    onClick={() => viewLogin(false)}>Sign Up
                </button>
                <button
                    style={{backgroundColor: isLogIn ? 'rgb(255,255,255)' : 'rgb(188,188,188)'}}
                    onClick={() => viewLogin(true)}>Login
                </button>
            </div>
        </div>
    </div>;
};
export default Auth;
