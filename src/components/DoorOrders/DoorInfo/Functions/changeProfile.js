import fraction from '../../../../utils/fraction';

const changeProfile = (p, ind, props, change) => {
  const { formState, dispatch } = props;

  const part = formState.part_list[ind];

  if (part?.orderType?.value === 'DF') {
    dispatch(
      change(
        'DoorOrder',
        `${p}.notes`,
        `Left Stile: ${fraction(
          part.profile ? part.profile.PROFILE_WIDTH : 0
        )}" Right Stile: ${fraction(
          part.profile ? part.profile.PROFILE_WIDTH : 0
        )}" \nTop Rail: ${fraction(
          part.profile ? part.profile.DF_Reduction : 0
        )} Bottom Rail: ${fraction(
          part.profile ? part.profile.DF_Reduction : 0
        )}"`
      )
    );

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.leftStile`,
        fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
      )
    );

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.rightStile`,
        fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
      )
    );

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.topRail`,
        fraction(part.profile ? part.profile.DF_Reduction : 0)
      )
    );

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.bottomRail`,
        fraction(part.profile ? part.profile.DF_Reduction : 0)
      )
    );
  } else {
    if (part.design?.TOP_RAIL_ADD > 0 || part.design?.BTM_RAIL_ADD > 0) {
      const topRailAdd = part.design?.TOP_RAIL_ADD;
      const bottomRailAdd = part.design?.BTM_RAIL_ADD;
      const profile_width = part.profile?.PROFILE_WIDTH;

      if (topRailAdd > 0 && bottomRailAdd > 0) {
        dispatch(
          change(
            'DoorOrder',
            `${p}.notes`,
            `Arched Top: ${fraction(topRailAdd)} Arched Bottom: ${fraction(
              bottomRailAdd
            )} \nLeft Stile: ${fraction(
              part.profile ? part.profile.PROFILE_WIDTH : 0
            )}" Right Stile: ${fraction(
              part.profile ? part.profile.PROFILE_WIDTH : 0
            )}" \nTop Rail: ${fraction(
              part.profile ? profile_width + topRailAdd : 0
            )} Bottom Rail: ${fraction(
              part.profile ? profile_width + bottomRailAdd : 0
            )}"`
          )
        );
      } else if (topRailAdd > 0) {
        dispatch(
          change(
            'DoorOrder',
            `${p}.notes`,
            `Arched Top: ${fraction(topRailAdd)}\nLeft Stile: ${fraction(
              part.profile ? part.profile.PROFILE_WIDTH : 0
            )}" Right Stile: ${fraction(
              part.profile ? part.profile.PROFILE_WIDTH : 0
            )}" \nTop Rail: ${fraction(
              part.profile ? profile_width + topRailAdd : 0
            )} Bottom Rail: ${fraction(
              part.profile ? profile_width + bottomRailAdd : 0
            )}"`
          )
        );
      } else if (bottomRailAdd > 0) {
        dispatch(
          change(
            'DoorOrder',
            `${p}.notes`,
            `Arched Bottom: ${fraction(bottomRailAdd)}\nLeft Stile: ${fraction(
              part.profile ? part.profile.PROFILE_WIDTH : 0
            )}" Right Stile: ${fraction(
              part.profile ? part.profile.PROFILE_WIDTH : 0
            )}" \nTop Rail: ${fraction(
              part.profile ? profile_width + topRailAdd : 0
            )} Bottom Rail: ${fraction(
              part.profile ? profile_width + bottomRailAdd : 0
            )}"`
          )
        );
      } else {
        dispatch(
          change(
            'DoorOrder',
            `${p}.notes`,
            `Left Stile: ${fraction(
              part.profile ? part.profile.PROFILE_WIDTH : 0
            )}" Right Stile: ${fraction(
              part.profile ? part.profile.PROFILE_WIDTH : 0
            )}" \nTop Rail: ${fraction(
              part.profile ? profile_width + topRailAdd : 0
            )} Bottom Rail: ${fraction(
              part.profile ? profile_width + bottomRailAdd : 0
            )}"`
          )
        );
      }
    } else {
      dispatch(
        change(
          'DoorOrder',
          `${p}.notes`,
          `Left Stile: ${fraction(
            part.profile ? part.profile.PROFILE_WIDTH : 0
          )}" Right Stile: ${fraction(
            part.profile ? part.profile.PROFILE_WIDTH : 0
          )}" \nTop Rail: ${fraction(
            part.profile ? part.profile.PROFILE_WIDTH : 0
          )} Bottom Rail: ${fraction(
            part.profile ? part.profile.PROFILE_WIDTH : 0
          )}"`
        )
      );
    }

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.leftStile`,
        fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
      )
    );

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.rightStile`,
        fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
      )
    );

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.topRail`,
        fraction(part.profile ? part.profile.PROFILE_WIDTH + part.design?.TOP_RAIL_ADD : 0)
      )
    );

    console.log({toprailadd: part.design?.TOP_RAIL_ADD});

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.bottomRail`,
        fraction(part.profile ? part.profile.PROFILE_WIDTH + part.design?.BTM_RAIL_ADD : 0)
      )
    );
  }

  if (part.dimensions) {
    part.dimensions.forEach((info, index) => {
      if (info) {
        if (part?.orderType?.value === 'DF') {
          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].leftStile`,
              fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
            )
          );

          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].rightStile`,
              fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
            )
          );

          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].topRail`,
              fraction(part.profile ? part.profile.DF_Reduction : 0)
            )
          );

          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].bottomRail`,
              fraction(part.profile ? part.profile.DF_Reduction : 0)
            )
          );

          if (parseInt(info.panelsH) > 1) {
            props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].horizontalMidRailSize`,
                fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
              )
            );
          }

          if (parseInt(info.panelsW) > 1) {
            props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].verticalMidRailSize`,
                fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
              )
            );
          }
        } else {
          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].leftStile`,
              fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
            )
          );

          props.dispatch(
            change(
              'DoorOrder',
              `${p}.leftStile`,
              fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
            )
          );

          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].rightStile`,
              fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
            )
          );

          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].topRail`,
              fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
            )
          );

          props.dispatch(
            change(
              'DoorOrder',
              `${p}.dimensions[${index}].bottomRail`,
              fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
            )
          );

          if (parseInt(info.panelsH) > 1) {
            props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].horizontalMidRailSize`,
                fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
              )
            );
          }

          if (parseInt(info.panelsW) > 1) {
            props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].verticalMidRailSize`,
                fraction(part.profile ? part.profile.PROFILE_WIDTH : 0)
              )
            );
          }
        }
      } else {
        return null;
      }
    });
  } else {
    return null;
  }
};

export default changeProfile;
