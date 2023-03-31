import fraction from '../../../../utils/fraction';

const changeProfile = (p, ind, props, change) => {
  const { formState, dispatch } = props;

  const part = formState.part_list[ind];

  if (
    part?.orderType?.value === 'DF' ||
    part?.orderType?.value === 'One_Piece_DF' ||
    part?.orderType?.value === 'Two_Piece_DF'
  ) {
    const topRail = part.profile
      ? part.profile.DF_Reduction
        ? part.profile.DF_Reduction
        : part.profile.PROFILE_WIDTH
      : 0;
    const bottomRail = part.profile
      ? part.profile.DF_Reduction
        ? part.profile.DF_Reduction
        : part.profile.PROFILE_WIDTH
      : 0;
    const leftStile = part.profile.PROFILE_WIDTH;
    const rightStile = part.profile.PROFILE_WIDTH;

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
              ? part.profile.DF_Reduction
                ? part.profile.DF_Reduction
                : part.profile.PROFILE_WIDTH
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
              ? part.profile.DF_Reduction
                ? part.profile.DF_Reduction
                : part.profile.PROFILE_WIDTH
              : 0
          )
        )
      );

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
    }
  } else {
    const topRail = part.profile.PROFILE_WIDTH + part.design?.TOP_RAIL_ADD;
    const bottomRail = part.profile.PROFILE_WIDTH + part.design?.BTM_RAIL_ADD;
    const leftStile = part.profile.PROFILE_WIDTH;
    const rightStile = part.profile.PROFILE_WIDTH;
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
    }
  }
};

export default changeProfile;
