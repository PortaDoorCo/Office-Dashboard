

export default (info, part) => {
  const lites = part.lite ? part.lite.NAME : '';
  const none = [
    {
      qty: '',
      measurement: `GLASS \n ${lites}`,
      pattern: ''
    },
  ];
  return none;
};
