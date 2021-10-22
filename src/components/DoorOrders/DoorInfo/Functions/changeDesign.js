
import fraction from '../../../../utils/fraction';

const changeProfile = (p, ind, props, change) => {

  const { formState } = props;

  

  const part = formState.part_list[ind];

  if(part?.construction?.value === 'Cope'){
    return null;
  } else {
    props.dispatch(
      change(
        'DoorOrder',
        `${p}.leftStile`,
        fraction(part.design ? part.design.PROFILE_WIDTH : 0)
      )
    );

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.rightStile`,
        fraction(part.design ? part.design.PROFILE_WIDTH : 0)
      )
    );

    if(part?.orderType?.value === 'DF'){

      if(part?.construction?.value === 'Miter'){
        props.dispatch(
          change(
            'DoorOrder',
            `${p}.topRail`,
            fraction(part.design ? (part.design.PROFILE_WIDTH) : 0)
          )
        );

        props.dispatch(
          change(
            'DoorOrder',
            `${p}.bottomRail`,
            fraction(part.design ? (part.design.PROFILE_WIDTH) : 0)
          )
        );
      } else {
        props.dispatch(
          change(
            'DoorOrder',
            `${p}.topRail`,
            fraction(part.design ? (part.design.DF_REDUCTION) : 0)
          )
        );

        props.dispatch(
          change(
            'DoorOrder',
            `${p}.bottomRail`,
            fraction(part.design ? (part.design.DF_REDUCTION) : 0)
          )
        );
      }



    } else {
      props.dispatch(
        change(
          'DoorOrder',
          `${p}.topRail`,
          fraction(part.design ? (part.design.PROFILE_WIDTH) : 0)
        )
      );

      props.dispatch(
        change(
          'DoorOrder',
          `${p}.bottomRail`,
          fraction(part.design ? (part.design.PROFILE_WIDTH) : 0)
        )
      );
    }

    props.dispatch(
      change(
        'DoorOrder',
        `${p}.notes`,
        `Left Stile: ${fraction(
          part.design ? (part.design.PROFILE_WIDTH) : 0
        )}" Right Stile: ${fraction(
          part.design ? (part.design.PROFILE_WIDTH) : 0
        )}" \nTop Rail: ${fraction(
          part.design ? (part.design.PROFILE_WIDTH) : 0
        )} Bottom Rail: ${fraction(
          part.design ? (part.design.PROFILE_WIDTH) : 0
        )}"`
      )
    );
  }




  if(part.dimensions){
    part.dimensions.forEach((info, index) => {
      if(info){

        if(part?.construction?.value === 'Cope'){
          return null;
        } else {
          if(part?.orderType?.value === 'DF'){
            props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].leftStile`,
                fraction(part.design ? part.design.PROFILE_WIDTH : 0)
              )
            );
  
            props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].rightStile`,
                fraction(part.design ? part.design.PROFILE_WIDTH : 0)
              )
            );
            
            if(part?.construction?.value === 'MT'){
              props.dispatch(
                change(
                  'DoorOrder',
                  `${p}.dimensions[${index}].topRail`,
                  fraction(part.design ? (part.design.DF_REDUCTION) : 0)
                )
              );
    
    
              props.dispatch(
                change(
                  'DoorOrder',
                  `${p}.dimensions[${index}].bottomRail`,
                  fraction(part.design ? (part.design.DF_REDUCTION) : 0)
                )
              );
            } else {
              props.dispatch(
                change(
                  'DoorOrder',
                  `${p}.dimensions[${index}].topRail`,
                  fraction(part.design ? (part.design.PROFILE_WIDTH) : 0)
                )
              );
    
    
              props.dispatch(
                change(
                  'DoorOrder',
                  `${p}.dimensions[${index}].bottomRail`,
                  fraction(part.design ? (part.design.PROFILE_WIDTH) : 0)
                )
              );
            }
  

  
  
            if (parseInt(info.panelsH) > 1) {
              props.dispatch(
                change(
                  'DoorOrder',
                  `${p}.dimensions[${index}].horizontalMidRailSize`,
                  fraction(part.design ? part.design.PROFILE_WIDTH : 0)
                )
              );
            } 
  
  
            if (parseInt(info.panelsW) > 1) {
              props.dispatch(
                change(
                  'DoorOrder',
                  `${p}.dimensions[${index}].verticalMidRailSize`,
                  fraction(part.design ? part.design.PROFILE_WIDTH : 0)
                )
              );
            }
          } else {
            props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].leftStile`,
                fraction(part.design ? part.design.PROFILE_WIDTH : 0)
              )
            );
  
            props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].rightStile`,
                fraction(part.design ? part.design.PROFILE_WIDTH : 0)
              )
            );
  
  
            props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].topRail`,
                fraction(part.design ? part.design.PROFILE_WIDTH : 0)
              )
            );
  
  
            props.dispatch(
              change(
                'DoorOrder',
                `${p}.dimensions[${index}].bottomRail`,
                fraction(part.design ? part.design.PROFILE_WIDTH : 0)
              )
            );
  
  
            if (parseInt(info.panelsH) > 1) {
              props.dispatch(
                change(
                  'DoorOrder',
                  `${p}.dimensions[${index}].horizontalMidRailSize`,
                  fraction(part.design ? part.design.PROFILE_WIDTH : 0)
                )
              );
            } 
  
  
            if (parseInt(info.panelsW) > 1) {
              props.dispatch(
                change(
                  'DoorOrder',
                  `${p}.dimensions[${index}].verticalMidRailSize`,
                  fraction(part.design ? part.design.PROFILE_WIDTH : 0)
                )
              );
            }
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