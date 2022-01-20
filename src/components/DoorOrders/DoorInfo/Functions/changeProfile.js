import fraction from '../../../../utils/fraction';

const changeProfile = (p, ind, props, change) => {
  const { formState, dispatch } = props;

  const part = formState.part_list[ind];

  if (part?.orderType?.value === 'DF') {
    if (part.profile?.PROFILE_WIDTH > 0) {
      props.dispatch(
        change(
          'Order',
          `${p}.leftStile`,
          fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
        )
      );

      props.dispatch(
        change(
          'Order',
          `${p}.rightStile`,
          fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
        )
      );

      props.dispatch(
        change(
          'Order',
          `${p}.topRail`,
          fraction(part.profile ? part.profile.DF_Reduction : 0)
        )
      );

      props.dispatch(
        change(
          'Order',
          `${p}.bottomRail`,
          fraction(part.profile ? part.profile.DF_Reduction : 0)
        )
      );
    }
  } else {
    if (part.profile?.PROFILE_WIDTH > 0) {
      props.dispatch(
        change(
          'Order',
          `${p}.leftStile`,
          fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
        )
      );

      props.dispatch(
        change(
          'Order',
          `${p}.rightStile`,
          fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
        )
      );

      props.dispatch(
        change(
          'Order',
          `${p}.topRail`,
          fraction(
            part.profile
              ? part.profile.PROFILE_WIDTH + part.design?.TOP_RAIL_ADD
              : 0
          )
        )
      );

      props.dispatch(
        change(
          'Order',
          `${p}.bottomRail`,
          fraction(
            part.profile
              ? part.profile.PROFILE_WIDTH + part.design?.BTM_RAIL_ADD
              : 0
          )
        )
      );
    }
  }
};

export default changeProfile;
