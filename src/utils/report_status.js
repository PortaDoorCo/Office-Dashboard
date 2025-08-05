const status = [
  {
    label: 'Quote',
    value: 'Quote',
  },
  {
    label: 'Ordered',
    value: 'Ordered',
  },
  {
    label: 'Complete',
    value: 'Complete',
  },
  {
    label: 'Invoiced',
    value: 'Invoiced',
  },
  // {
  //   label: 'Flagged',
  //   value: 'Flagged',
  // },
  // {
  //   label: 'Order Numbers',
  //   value: 'Order Numbers',
  // },
  // {
  //   label: 'One Piece',
  //   value: 'One Piece',
  // },
];

/**
 * Returns status options filtered by user role
 * @param {Object} role - User role object with type property
 * @returns {Array} Filtered status array based on role
 */
export const getStatusByRole = (role) => {
  if (role?.type === 'office') {
    return status.filter(s => s.value === 'Quote' || s.value === 'Ordered');
  }
  return status;
};

export default status;
