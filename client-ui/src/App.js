import React from 'react';
import axios from 'axios'
import './App.css';

function ClientTaskList(props){
  return(
    <div>
      <h3>Client Tasks</h3>
      <ul className="taskList">
        {props.tasks.map((task) =>(
          <li key={task[0]} className="tasks">
            <span className="task">{task[1]}</span>
            <button onClick={() => props.completeTask(task[0])}>Complete</button>
            <br />
            <span className="list">{task[2]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

class App extends React.Component{

  constructor(props){
    super(props)
      this.state={
        clientTasks: []
      }
  }

  getTaskLists(boardId){
    var apiKey = "6b4bfdf2a878cdd5935ad1f89b19b828";
    var oauthToken = "2222c8bc7d6190a34eda3cfa77d8444954447c042cfb6e6609df5e21e536888e";
    var boardID = boardId
    var url = `https://api.trello.com/1/boards/${boardID}/lists?key=${apiKey}&token=${oauthToken}`;
    return axios.get(url).then((response) => this.mapTaskLists(response.data))
  }

  mapTaskLists(data){
    var taskLists = new Map()
    var i;
    for (i=0; i<data.length; i++){
      taskLists.set(data[i].id, data[i].name)
    }
    return taskLists
  }

  getTasks(boardId){
    var apiKey = "6b4bfdf2a878cdd5935ad1f89b19b828";
    var oauthToken = "2222c8bc7d6190a34eda3cfa77d8444954447c042cfb6e6609df5e21e536888e";
    var boardID = boardId
    var url = `https://api.trello.com/1/boards/${boardID}/cards?key=${apiKey}&token=${oauthToken}`;
    return axios.get(url)

  }

  filterClientTasks(data){
    var i;
    var j;
    var clientTaskIds = []
    for (i=4; i<data.length; i++){
      for (j=0; j<data[i].labels.length; j++){
        if (data[i].labels[j].name==="CLIENT" && data[i].idList!=="5d6ee5ce0766e112671af869"){
          clientTaskIds.push([data[i].id,data[i].idList])
        }
      }
    }
    return clientTaskIds
  }

  getClientTasks(clientIds){
    var apiKey = "6b4bfdf2a878cdd5935ad1f89b19b828";
    var oauthToken = "2222c8bc7d6190a34eda3cfa77d8444954447c042cfb6e6609df5e21e536888e";
    var i;
    var urls=''
    for (i=0; i<clientIds.length; i++){
      urls+=`/cards/${clientIds[i][0]}/name`
      if (i<clientIds.length-1){
        urls+=","
      }
    }
    var url=`https://api.trello.com/1/batch/?urls=${urls}&key=${apiKey}&token=${oauthToken}`
    return axios.get(url).then((response)=> response.data)

  }

  mapClientTasks(clientId, clientTasks, taskList){
    var i;
    var clientIdTask = []
    for (i=0; i<clientId.length; i++){
      clientIdTask.push([clientId[i][0],clientTasks[i][200],taskList.get(clientId[i][1])])
    }
    return clientIdTask
  }

  completeTask(taskId){
    console.log(taskId)
    var apiKey = "6b4bfdf2a878cdd5935ad1f89b19b828";
    var oauthToken = "2222c8bc7d6190a34eda3cfa77d8444954447c042cfb6e6609df5e21e536888e";
    var url = `https://api.trello.com/1/cards/${taskId}/idList?value=5d6ee5ce0766e112671af869&key=${apiKey}&token=${oauthToken}`
    var headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
    console.log(url)
    axios.put(url, headers)
  }

  componentDidMount(){
    var trelloResponse;
    var clientTaskIds;
    var taskLists;
    var boardID = "cCf3tlXC";
    this.getTaskLists(boardID).then((response) => taskLists = response).then(() => this.getTasks(boardID)).then((response) => trelloResponse=response.data).then(() => this.filterClientTasks(trelloResponse)).then((clientIdData) => clientTaskIds = clientIdData).then(() => this.getClientTasks(clientTaskIds)).then((clientTaskData)=> this.setState({
        clientTasks: this.mapClientTasks(clientTaskIds, clientTaskData, taskLists)
      })
      )

  }
  componentDidUpdate(){
    console.log(this.state.clientTasks)
  }

  render(){
    return (
      <div>
        <ClientTaskList
          tasks={this.state.clientTasks}
          completeTask={this.completeTask}
        />
      </div>
    )
  }

}

export default App;
