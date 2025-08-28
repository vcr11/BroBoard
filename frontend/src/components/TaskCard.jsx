import React from 'react';

const TaskCard = ({ task }) => {
  return (
    <div className="bg-gray-900 rounded-xl shadow-md p-4 hover:shadow-lg transition duration-300">
      <h3 className="text-xl font-semibold mb-2 text-white">{task.title}</h3>

      <p className="text-gray-300 text-sm mb-2">{task.description}</p>

      <div className="text-sm text-gray-400 mb-1">
        <strong>Assigned To:</strong> {task.assignedTo?.name || task.assignedTo}
      </div>

      <div className="text-sm text-gray-400 mb-2">
        <strong>Due Date:</strong>{' '}
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not specified'}
      </div>

      {task.completed !== undefined && (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            task.completed
              ? 'bg-green-600 text-white'
              : 'bg-yellow-500 text-white'
          }`}
        >
          {task.completed ? 'Completed' : 'Pending'}
        </span>
      )}
    </div>
  );
};

export default TaskCard;
