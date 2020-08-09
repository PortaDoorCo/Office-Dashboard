const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'John is interested in a door - Justin' },
    'task-2': { id: 'task-2', content: 'New Customer Interested in FL - John Smith' },
    'task-3': { id: 'task-3', content: 'Call Jeff at 12 - Justin ' },
    'task-4': { id: 'task-4', content: 'Finish the app - Justin' },
    'task-5': { id: 'task-5', content: 'Return email to Sarah - John' }
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Lead',
      taskIds: ['task-1', 'task-4', 'task-5']
    },
    'column-2': {
      id: 'column-2',
      title: 'Pitch',
      taskIds: []
    },
    'column-3': {
      id: 'column-3',
      title: 'Negotiation',
      taskIds: ['task-2']
    },
    'column-4': {
      id: 'column-4',
      title: 'Closing',
      taskIds: []
    },
    'column-5': {
      id: 'column-5',
      title: 'Won',
      taskIds: ['task-3']
    }
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5']
};
  
export default initialData;
  