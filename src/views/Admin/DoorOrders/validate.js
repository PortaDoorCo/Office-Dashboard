const validate = values => {
  const errors = {};

  const partArrayErrors = [];
  values && values.part_list && values.part_list.forEach((part, memberIndex) => {
    const partListErrors = {};
    if (!part && !part.dimensions && !part.dimensions.length < 1) {
      partListErrors.dimensions = 'Required';
      partArrayErrors[memberIndex] = partListErrors;
    }
  });
  if (partArrayErrors.length) {
    errors.part_list = partArrayErrors;
  }

  console.log({partArrayErrors});
  

  console.log({errors});
  return errors;
};

export default validate;