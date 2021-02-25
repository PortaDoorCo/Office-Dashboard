const validate = values => {
  const errors = {};

  const partArrayErrors = [];
  values && values.part_list && values.part_list.forEach((part, memberIndex) => {
    const partListErrors = {};

    console.log(!part || !part.dimensions || !part.dimensions.length < 1);
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
  return errors;
};

export default validate;