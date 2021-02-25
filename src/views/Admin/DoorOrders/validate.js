const validate = values => {
  const errors = {};

  if (!values.part_list || !values.part_list.length) {
    errors.part_list = { _error: 'At least one member must be entered' };
  } else {
    const partArrayErrors = [];
    values && values.part_list && values.part_list.forEach((part, memberIndex) => {
      const partListErrors = {};
  
      console.log({part});
      if (!part || !part.dimensions || !part.dimensions.length) {
  
        console.log('HEREEEE');  
  
  
        partListErrors.dimensions = 'Required';
        partArrayErrors[memberIndex] = partListErrors;
      }
  
      console.log({partListErrors});
    });
  
  
    if (partArrayErrors.length) {
      errors.part_list = partArrayErrors;
    }
  
    console.log({partArrayErrors});
    console.log({errors});
  }

  


  return errors;
};

export default validate;