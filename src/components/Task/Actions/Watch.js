import React, { useState } from 'react';

import { Api, Session } from 'aionic-library';

const TaskActionsWatch = (props) => {
	const { task, updateParentLoading } = props;

	const [isTaskWatched, setIsTaskWatched] = useState(
		Session.getUser().tasksWatched.find((wTask) => wTask.id === task.id)
	);

	const toggleWatchTask = async () => {
		const { tasksWatched } = Session.getUser();

		if (isTaskWatched) {
			const taskIdx = tasksWatched.findIndex((wTask) => wTask.id === task.id);
			tasksWatched.splice(taskIdx, 1);
			setIsTaskWatched(false);
		} else {
			tasksWatched.push(task);
			setIsTaskWatched(true);
		}

		const user = { ...Session.getUser(), tasksWatched };

		updateParentLoading(true);

		await Api.putData(`users/${Session.getUser().id}`, {
			user
		});

		Session.setUser(user);
		updateParentLoading(false);
	};

	return (
		<div className="TaskActionsWatch">
			{isTaskWatched ? (
				<button type="button" className="btn dropdown-item" onClick={toggleWatchTask}>
					<i className="far fa-heart fa-fw mr-1" /> Unwatch
				</button>
			) : (
				<button type="button" className="btn dropdown-item" onClick={toggleWatchTask}>
					<i className="fas fa-heart fa-fw mr-1" /> Watch
				</button>
			)}
		</div>
	);
};

TaskActionsWatch.defaultProps = {
	updateParentLoading: () => {}
};

export default TaskActionsWatch;
