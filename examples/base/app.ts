import axios from '../../dist/axiosts.umd';

axios({
  method: 'get',
  url: '/simple/get',
  params: {
    a: 1,
    b: 2,
    v: '@'
  }
})
