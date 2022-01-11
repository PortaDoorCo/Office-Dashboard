const validate = (values) => {
  const errors = {};

  if (!values.part_list || !values.part_list?.length) {
    errors.part_list = { _error: 'At least one member must be entered' };
  } else {
    const partArrayErrors = [];
    values &&
      values.part_list &&
      values.part_list.forEach((part, memberIndex) => {
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
