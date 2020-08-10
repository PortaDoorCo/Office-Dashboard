import db_url from '../db_url';

export const LOAD_SALES = 'LOAD_SALES';


export function loadSales(cookie) {
  return async function (dispatch) {
    const res = await fetch(`${db_url}/sales`,
      {
        headers: {
          'Authorization': `Bearer ${cookie}`
        }
      }
    );
    const data = await res.json();
    return dispatch({
      type: LOAD_SALES,
      data: data
    });
  };
}












