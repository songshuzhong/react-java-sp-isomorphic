/**
 * Created by renxuanwei on 2018/1/16.
 */

const getInitArray = ( initString ) => {
  let initValueArray = initString.substring( initString.indexOf( '[' ) + 1, initString.indexOf( ']' ) ).split( '},' );
  //console.log('init value.................');
  //console.log(initValueArray);
  let resultArray = [];

  if ( initValueArray.length > 0 ) {
    for ( let i = 0; i < initValueArray.length; i++ ) {
      let f = "}";

      if ( i === initValueArray.length - 1 ) {
       f = "";
      }

      let val = JSON.parse( initValueArray[ i ] + f );
      let iKey = Object.keys( val )[ 0 ];

      resultArray.push( {
        'text': iKey,
        'value': val[ iKey ]
      } );
    }
  }

 // console.log(resultArray);

  return resultArray;
};

export { getInitArray };
export default getInitArray;