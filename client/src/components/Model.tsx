import React, {FormEvent, useState} from "react";
import {useCookies} from "react-cookie";

interface Props {
    mode: string,
    setShowModel: any
    task?: {
        id: string,
        user_email: string,
        title: string,
        progress: number,
        date: string
    },
    getData?: any
}

const Model: React.FC<Props> = ({mode, setShowModel, task, getData}) => {
    const [cookies, setCookies, removeCookies] = useCookies()
    const editMode = mode === "edit" ? true : false;
    const [data, setData] = useState({
        user_email: editMode && task ? task.user_email : cookies.Email,
        title: editMode && task ? task.title : "",
        progress: editMode && task ? task.progress : 50,
        date: editMode && task ? task.date : new Date().toDateString()
    });

    const postData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/todos/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            });
            if (response.status === 201) {
                setShowModel(false)
                getData()
            }

        } catch (err) {
            console.error(err);
        }
    };

    const editData = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/todos/${task && task.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })
            if (response.status === 203) {
                setShowModel(false);
                getData()
            }
        } catch (err) {
            console.error(err)
        }
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setData(data => ({
            ...data,
            [name]: value
        }));
        console.log(data)
    };
    return (
        <div className="overlay">
            <div className="model">
                <div className="form-title-container">
                    <h3>let's {mode} you ask</h3>
                    <button onClick={() => setShowModel(false)}>X</button>
                </div>
                <form onSubmit={editMode ? editData : postData}>
                    <label htmlFor="title">
                        Drag to select your current title
                    </label>
                    <input id="title" type="text" required maxLength={30} placeholder='your task goes here' name="title"
                           value={data.title} onChange={handleChange}/>
                    <label htmlFor="progress">Drag to select your current progress</label>
                    <input id="progress" type="range" min="0" max="100" name="progress" value={data.progress}
                           onChange={handleChange}/>
                    <input className={mode} type="submit"/>
                </form>
            </div>
        </div>
    );
};
export default Model;