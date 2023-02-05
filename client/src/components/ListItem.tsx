import React, {useState} from "react";
import ProgressBar from "./ProgressBar";
import TickIcon from "./TickIcon";
import Model from "./Model";


interface Props {
    task: {
        id: string,
        user_email: string,
        title: string,
        progress: number,
        date: string
    };
    getData?: any;
    key: string
}

const ListItem: React.FC<Props> = ({task, getData, key}) => {
    const [showModel, setShowModel] = useState(false)

    const deleteData = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/todos/${task && task.id}`, {method: "DELETE"})
            if (response.status === 200) {
                console.log('deleted successfully')
                getData()
            }
        } catch (err) {
            console.error(err)
        }
    }
    return (
        <li className="list-item">
            <div className="info-container">
                <TickIcon/>
                <p className="task-title">{task.title}</p>
                <ProgressBar/>
            </div>
            <div className="button-container">
                <button className="edit" onClick={() => setShowModel(true)}>Edit</button>
                <button className="delete" onClick={(event:any)=>deleteData(event)}>Delete</button>
            </div>
            {showModel && <Model mode={'edit'} setShowModel={setShowModel} task={task} getData={getData}/>}
        </li>
    );
};
export default ListItem;
