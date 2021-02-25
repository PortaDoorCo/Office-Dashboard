const validate = values => {
  const errors = {};
  if (!values.part_list || !values.part_list.length > 0) {
    errors.part_list = { _error: 'At least one item must be entered' };
  } else {
    const part_list_errors = [];
    values.part_list.forEach((part, index) => {
      const partErrors = {};
      if(!part && !part.dimensions && !part.dimensions.length > 0){
        partErrors.dimensions = { _error: 'At least one item must be entered' };
        part_list_errors[index] = partErrors;
      }
    });
    if (part_list_errors.length) {
      errors.part_list = part_list_errors;
    }
  }
  return errors;
};
  
export default validate;