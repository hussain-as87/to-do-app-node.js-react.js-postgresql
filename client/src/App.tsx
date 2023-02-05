import React, { useEffect, useState } from "react";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";

const App = () => {
  const userEmail = "adda8mad@gmail.com";
  const [tasks, setTasks] = useState<any[]>([]);
  const getData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/todos/${userEmail}`);
      const json = await response.json();
       setTasks(json);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
//sort by date 
const sortedTasks = tasks?.sort((a: { date: string }, b: { date: string }) => new Date(a.date).valueOf() - new Date(b.date).valueOf());
  
return (
    <div className="app">
      <ListHeader listName={"Holiday tick list 🎉"}  getData={getData}/>
      {sortedTasks?.map((task:any)=><ListItem key={task.id} task={task} getData={getData}/>)}
    </div>
  );
};

export default App;
