import fraction from '../../../../utils/fraction';

const changeProfile = (p, ind, props, change) => {
  const { formState } = props;

  const part = formState.part_list[ind];

  let leftStile = part?.design?.PROFILE_WIDTH;
  let rightStile = part?.design?.PROFILE_WIDTH;
  let topRail = part?.design?.PROFILE_WIDTH;
  let bottomRail = part?.design?.PROFILE_WIDTH;

  if (part?.construction?.value === 'Cope') {
    return null;
  } else {
    props.dispatch(
      change(
        'Order',
        `${p}.leftStile`,
        fraction(part.design ? part.design.PROFILE_WIDTH : 0)
      )
    );

    props.dispatch(
      change(
        'Order',
        `${p}.rightStile`,
        fraction(part.design ? part.design.PROFILE_WIDTH : 0)
      )
    );

    if (part?.orderType?.value === 'DF') {
      if (part?.construction?.value === 'Miter') {
        props.dispatch(
          change(
            'Order',
            `${p}.topRail`,
            fraction(part.design ? part.design.PROFILE_WIDTH : 0)
          )
        );

        props.dispatch(
          change(
            'Order',
            `${p}.bottomRail`,
            fraction(part.design ? part.design.PROFILE_WIDTH : 0)
          )
        );
      } else {
        topRail = part?.design?.DF_REDUCTION;
        bottomRail = part?.design?.DF_REDUCTION;

        props.dispatch(
          change(
            'Order',
            `${p}.topRail`,
            fraction(part.design ? part.design.DF_REDUCTION : 0)
          )
        );

        props.dispatch(
          change(
            'Order',
            `${p}.bottomRail`,
            fraction(part.design ? part.design.DF_REDUCTION : 0)
          )
        );
      }
    } else {
      props.dispatch(
        change(
          'Order',
          `${p}.topRail`,
          fraction(part.design ? part.design.PROFILE_WIDTH : 0)
        )
      );

      props.dispatch(
        change(
          'Order',
          `${p}.bottomRail`,
          fraction(part.design ? part.design.PROFILE_WIDTH : 0)
        )
      );
    }
  }

  props.dispatch(
    change(
      'Order',
      `part_list[${ind}].notes`,
      `Left Stile: ${fraction(leftStile)}" Right Stile: ${fraction(
        rightStile
      )}" \nTop Rail: ${fraction(topRail)}" Bottom Rail: ${fraction(
        bottomRail
      )}"`
    )
  );
};

export default changeProfile;
