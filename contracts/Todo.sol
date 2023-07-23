// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Todo {
    uint256 public numberOfTasks;

    struct Task {
        string description;
        bool completed;
    }

    Task[] public tasksList;

    event TaskCreated(string description, bool completed);

    function addTask(string memory _description) public {
        Task memory newTask = Task(_description, false);
        tasksList.push(newTask);
        numberOfTasks++;
        emit TaskCreated(_description, false);
    }

    function prioritiseTask(uint256 _id) external {
        require(_id >= 1, "Currently It is Top Priority Task");
        require(_id < numberOfTasks, "Task is not Present");

        Task memory temp = tasksList[_id];
        tasksList[_id] = tasksList[_id - 1];
        tasksList[_id - 1] = temp;
    }

    function dePrioritiseTask(uint256 _id) external {
        require(_id < numberOfTasks - 1, "Currently It is Less Priority Task");
        require(_id >= 0, "Task is not Present");

        Task memory temp = tasksList[_id];
        tasksList[_id] = tasksList[_id + 1];
        tasksList[_id + 1] = temp;
    }

    function deleteTask(uint256 _id) external {
        tasksList[_id] = tasksList[tasksList.length - 1];
        tasksList.pop();
    }
}
