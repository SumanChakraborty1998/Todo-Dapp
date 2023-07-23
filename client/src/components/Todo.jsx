import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ethers } from "ethers";
import TodoList from "../artifacts/contracts/Todo.sol/Todo.json";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import { Loader } from "./Loader";

export const Todo = () => {
  let contract;
  let provider;
  //   let numberOfTasks;

  const address = "0x17DF1407bE74Bdc98D293dabAE73bFAf8a592074";
  const abi = TodoList.abi;

  const [todo, setTodo] = React.useState("");
  const [taskList, setTaskList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const connect = async () => {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    contract = new ethers.Contract(address, abi, provider.getSigner());
  };

  const connectToDatabase = async () => {
    // console.log(address, abi);

    if (window.ethereum) {
      await connect();
    } else {
      alert("Please connect to MetaMask");
    }
  };

  const handleAdd = async () => {
    await connect();
    setIsLoading(true);
    const tx = await contract.addTask(todo);
    await tx.wait();
    setTodo("");
    handleGetTasks();
  };

  const handleGetTasks = async () => {
    // console.log(contract);
    // contract = new ethers.Contract(address, abi, provider.getSigner());
    const number = await contract.numberOfTasks();
    // console.log(number.toString());
    setTaskList((prev) => []);
    setIsLoading(true);
    let list = [];

    for (let i = 0; i < number.toString(); i++) {
      const tasks = await contract.tasksList(i);
      //   await tasks.wait();
      // console.log(tasks);
      if (tasks.description !== "") {
        list.push(tasks);
      }
    }
    setTaskList(list);
    setIsLoading(false);

    // console.log(taskList);
  };

  const handleDelete = async (id) => {
    await connect();
    setIsLoading(true);
    const tx = await contract.deleteTask(id);
    await tx.wait();
    handleGetTasks();
  };

  const handleUpgradePriority = async (id) => {
    await connect();
    setIsLoading(true);
    const tx = await contract.prioritiseTask(id);
    await tx.wait();
    handleGetTasks();
  };
  const handleDowngradePriority = async (id) => {
    await connect();
    setIsLoading(true);
    const tx = await contract.dePrioritiseTask(id);
    await tx.wait();
    handleGetTasks();
  };

  React.useEffect(() => {
    const asyncFunc = async () => connectToDatabase();
    asyncFunc();
  }, []);

  React.useEffect(() => {
    const asyncFunc = async () => handleGetTasks();
    asyncFunc();
  }, []);

  // console.log(taskList);

  return (
    <div>
      <h2>Todo List || Dapp</h2>
      <div style={{ maxWidth: "500px", margin: "auto" }}>
        <TextField
          label="Add Task"
          onChange={(e) => setTodo(e.target.value)}
          value={todo}
          variant="outlined"
          disabled={isLoading}
          fullWidth
        />
      </div>
      <br />

      <Button
        disabled={isLoading}
        variant="contained"
        onClick={() => handleAdd()}
      >
        ADD
      </Button>
      <br />
      <br />
      {taskList.length == 0 && !isLoading && <div>No Tasks Present</div>}

      {isLoading ? (
        <div>
          <Loader />
        </div>
      ) : (
        taskList.map((task, index) => {
          //   task = task.split(",");
          return (
            task.description !== "" && (
              <div
                key={index}
                style={{
                  border: "1px solid black",
                  width: "500px",
                  margin: "auto",
                  marginTop: "10px",
                  padding: "5px 5px",
                  borderRadius: "5px",
                  fontSize: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>{task.description}</div>
                <div>
                  <IconButton onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleUpgradePriority(index)}
                    disabled={index == 0}
                  >
                    <UpgradeIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDowngradePriority(index)}
                    disabled={index == taskList.length - 1}
                  >
                    <VerticalAlignBottomIcon />
                  </IconButton>
                </div>
                {/* <div>{task[2]}</div> */}
              </div>
            )
          );
        })
      )}
    </div>
  );
};
