import { useState } from "react";

interface Task {
	id: string;
	text: string;
}

const DEFAULT_TASKS: Array<Task> = [
	{
		id: "1",
		text: "Walk the dog",
	},
	{
		id: "2",
		text: "Water the plants",
	},
	{
		id: "3",
		text: "Wash the dishes",
	},
];

export default function App() {
	const [taskList, setTaskList] = useState(DEFAULT_TASKS);

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const taskText = String(data.get("task")).trim();
		if (!taskText) {
			return;
		}
		const task: Task = {
			id: crypto.randomUUID(),
			text: taskText,
		};
		setTaskList([...taskList, task]);
		e.currentTarget.reset();
	};

	const handleDelete = (id: string) => {
		const filteredList = taskList.filter((task) => task.id !== id);
		setTaskList(filteredList);
	};

	const empty = () => <p>Todo List Empty: Add some.</p>;

	const todoList = () => (
		<ul>
			{taskList.map((task) => (
				<li key={task.id}>
					<span>{task.text}</span>
					<button
						aria-label={`Delete ${task.text}`}
						onClick={() => handleDelete(task.id)}
						type="button"
					>
						Delete
					</button>
				</li>
			))}
		</ul>
	);

	return (
		<div>
			<h1>Todo List</h1>
			<div>
				<form onSubmit={handleSubmit}>
					<label htmlFor="task">New task</label>
					<input
						id="task"
						name="task"
						type="text"
						placeholder="Add your task"
					/>
					<br />
					<button type="submit">Submit</button>
				</form>
			</div>
			{taskList.length === 0 ? empty() : todoList()}
		</div>
	);
}
