

export default (data) => {


  let array = [];

  const start = data.part_list.map(i => {

    return i.dimensions.map(j => {
      return console.log({j});
    });
  });

  return console.log({start});
};
