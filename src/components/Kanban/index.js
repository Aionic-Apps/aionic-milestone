import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

import { Api, Pills } from 'aionic-library';

import Helper from '../../services/helper';

import KanbanLoader from './Loader';
import KanbanStatus from './Status';
import KanbanFilters from './Filters';

const Kanban = (props) => {
	const { taskList, userList, statusList } = props;

	const [currentTasks, setCurrentTasks] = useState(taskList);
	const [isLoading, setIsLoading] = useState(false);
	const [stretch, setStretch] = useState(false);

	const [taskFilters, setTaskFilters] = useState({
		textFilter: '',
		priorityFilter: 0
	});

	const filteredTasks = currentTasks.filter((task) => {
		const condText = taskFilters.textFilter.length
			? task.title.toLowerCase().includes(taskFilters.textFilter)
			: true;
		const condPrio = taskFilters.priorityFilter
			? task.priority.value === taskFilters.priorityFilter
			: true;

		return condText && condPrio;
	});

	const tabTitles = userList.map((user) => {
		const userNameDuplicates = userList.filter((user2) => {
			return user2.id !== user.id && user2.firstname === user.firstname;
		});

		return {
			id: user.id,
			name: userNameDuplicates.length
				? `${user.firstname} ${user.lastname.charAt(0)}.`
				: user.firstname
		};
	});

	const handleUserChange = async (firstname, userID) => {
		if (userID) {
			try {
				setCurrentTasks([]);
				setIsLoading(true);

				const userTaskList = await Api.fetchData(`users/${userID}/tasks`);

				setCurrentTasks(userTaskList);
				setIsLoading(false);
			} catch (err) {
				console.log(err);
			}
		} else {
			setCurrentTasks(taskList);
		}
	};

	const toggleStretch = () => {
		setStretch(!stretch);
	};

	const handleTaskDrop = async (taskID, statusID) => {
		const taskIdx = currentTasks.findIndex((task) => task.id === taskID);

		const currentTasksCopy = currentTasks.slice();
		const taskToUpdate = currentTasksCopy[taskIdx];

		if (taskToUpdate.status.id !== statusID) {
			taskToUpdate.status = statusList.find((status) => status.id === statusID);

			currentTasksCopy[taskIdx] = await Api.putData(`tasks/${taskToUpdate.id}`, {
				task: taskToUpdate
			});
			setCurrentTasks(currentTasksCopy);
		}
	};

	const loadingSpinner = isLoading ? (
		<div className="row mt-3">
			<div className="col-12">
				<KanbanLoader />
			</div>
		</div>
	) : null;

	const tabs = tabTitles.length ? (
		<div className="row">
			<div className="col-auto mb-4">
				<Pills tabs={tabTitles} handleClick={handleUserChange} />
			</div>
		</div>
	) : null;

	return (
		<div className="Kanban">
			{tabs}
			<KanbanFilters
				toggleStretch={toggleStretch}
				taskFilters={taskFilters}
				setTaskFilters={setTaskFilters}
			/>
			<DndProvider backend={Backend}>
				<div className="row flex-nowrap overflow-auto mt-3" style={{ padding: '0px 5px' }}>
					{statusList.map((status) => {
						const tasks = filteredTasks.filter(
							(task) => task.status && task.status.id === status.id
						);
						return (
							<KanbanStatus
								key={status.id}
								status={status}
								tasks={tasks}
								maxWidth={stretch ? 30 : Math.max(100 / statusList.length, 15)}
								handleTaskDrop={handleTaskDrop}
							/>
						);
					})}
				</div>
			</DndProvider>
			{loadingSpinner}
		</div>
	);
};

Kanban.defaultProps = {
	taskList: [],
	userList: [],
	statusList: Helper.getTaskStatus()
};

export default Kanban;
