import axios from '../../dist/axiosts.umd';

axios({
  method: 'get',
  url: '/simple/get',
  params: {
    a: 1,
    b: 2,
    v: '@'
  },
  data: {
    a: 1,
    b: 2,
    arr: new Int32Array([16, 31])
  }
})
