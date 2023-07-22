// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Todo {
    uint256 public numberOfTasks;

    struct Task {
        uint256 id;
        string description;
        bool completed;
        uint priority;
    }

    mapping(uint256 => Task) public tasks;

    event TaskCreated(
        uint256 id,
        string description,
        bool completed,
        uint priority
    );

    function addTask(string memory _description) public {
        numberOfTasks++;
        tasks[numberOfTasks] = Task(
            numberOfTasks,
            _description,
            false,
            numberOfTasks
        );
        emit TaskCreated(numberOfTasks, _description, false, numberOfTasks);
    }

    function prioritiseTask(uint256 _id) external {
        require(_id >= 1, "Invalid Id");

        Task memory currentTask = tasks[_id];
        Task memory previousTask = tasks[_id - 1];

        tasks[_id] = previousTask;
        tasks[_id - 1] = currentTask;

        tasks[_id].priority = currentTask.priority;
        tasks[_id - 1].priority = previousTask.priority;
    }

    function toggleTask(uint256 _id) external {
        tasks[_id].completed = !tasks[_id].completed;
    }

    function deleteTask(uint256 _id) external {
        delete tasks[_id];
    }
}
