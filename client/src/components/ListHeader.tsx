import React, {useState} from "react";
import Model from "./Model";

interface Props {
    listName: any,
    getData?:any
}


const ListHeader: React.FC<Props> = ({listName,getData}) => {
    const [showModel, setShowModel] = useState(false);
    const signOut = () => {
        console.log('sign out')
    }
    return <div className="list-header"><h1>{listName}</h1>
        <div className="button-container">
            <button className="create" onClick={() => setShowModel(true)}>Create</button>
            <button className="sign-out" onClick={signOut}>Sign Out</button>
        </div>
        {showModel && <Model mode={"create"} setShowModel={setShowModel} getData={getData}/>}
    </div>;
};
export default ListHeader;
  