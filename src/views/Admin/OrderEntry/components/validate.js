const validate = values => {
  const errors = {};

  console.log({values});

  if (!values.part_list || !values.part_list?.length < 1) {

    if(values?.misc_items?.length < 1){
      return;
    } else {
      errors.part_list = { _error: 'At least one member must be entered' };
    }
    
  } else {
    const partArrayErrors = [];
    values && values.part_list && values.part_list.forEach((part, memberIndex) => {
      const partListErrors = {};
  

      if (!part || !part.dimensions || !part.dimensions.length) {
  

  
  
        partListErrors.dimensions = 'Required';
        partArrayErrors[memberIndex] = partListErrors;
      }
  

    });
  
  
    if (partArrayErrors.length) {
      errors.part_list = partArrayErrors;
    }

  }

  


  return errors;
};

export default validate;