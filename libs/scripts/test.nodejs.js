const id = '64485c8a04a7deeaa753f035';
const protocol = 'http://';
//const host = 'dev.affico360.com';
const host = 'api.socialpushh.com';
const port = 80;
const headers = {
  'WEBPAGES-BUILDER-API-KEY':
    '$2b$10$6EhC6Wsk6LUCNz5g.sUzTeDCgh9.W1/8/ieRD19sMx9wyGwwPIiKS',
};
const authorization =
  'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3MDUzMjgxODIsImV4cCI6MTcwNTQxMDk4MiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9yZXNvdXJjZXMiLCJhZmZpbGlhdGVhcGkiXSwiY2xpZW50X2lkIjoiYWZmaWxpYXRlYXBpLmNsaWVudCIsInN1YiI6ImQxMWQ1NGE5LWIwMWEtNGJmNy1iNTYyLTlmOWVjMGZmM2VhNiIsImF1dGhfdGltZSI6MTcwNTMyODE4MiwiaWRwIjoibG9jYWwiLCJuYW1lIjoibGF0YW1ncm91cF9meGludGVncmFsIiwibWV0aG9kcyI6WyJHZXRBY2NvdW50cyIsIlJlZ2lzdHJhdGlvbldpdGhTU08iLCJDcmVhdGVSZWFsV2l0aFRva2VuIiwiQ3JlYXRlUmVhbCIsIkNyZWF0ZUxlYWQiLCJHZXRGdGRUcmFuc2FjdGlvbnMiXSwiYWxsb3dlZGlwIjoiMTQ4LjI0NC4xMjYuMjE4LDE3Mi4yMC41OC40MywzLjE4LjEyNC4xNywyMDEuMTQxLjIxOC4xMzUsMTgxLjIwNS4xNTAuNjAsNTAuMTguMTA4Ljg0LDEzLjU2LjMxLjE3NiwxODUuMTI3LjE4LjkwLDUwLjE4LjEwOC44NCwxODEuMjA1LjE0My4yMTMsNTAuMTguNzMuMTE3LDUwLjE4LjEwOC44NCIsImFsbG93ZWRpcHJhbmdlIjoiMS4xLjEuMS0yNTUuMjU1LjI1NS4yNTUiLCJvcmdhbml6YXRpb24iOiJMYXRhbUdyb3VwIiwiYWZmaWxpYXRlIjoibGF0YW1ncm91cF9meGludGVncmFsIiwic2NvcGUiOlsiYWZmaWxpYXRlYXBpIl0sImFtciI6WyJwd2QiXX0.q1WRkfM5kjD6qdP_bG6Ds-H0LNsdDBC7cbGXBpS1A9qyDf_lxge_YbW0IMgHoRAPqIzbkbJte2ty-8eW7rN52A';

requestHttp('PLANS', 'GET', `plan`, false);
/* requestHttp('LOGIN', 'POST', `auth/login`, false, {
  password: '123Abc',
  email: 'hender@grupoedb.com',
  code: '417911',
}); */
/* requestHttp('BEFORE UPDATE CFT to FTD', 'GET', `lead/64485c9504a7deeaa753f0fc`)
  .then(() =>
    requestHttp('UPDATE SOURCES TYPE', 'PATCH', `lead/cftd-to-ftd`, [
      {
        id: '64485c9504a7deeaa753f0fc',
        showToAffiliate: true,
      },
    ]),
  )
  .then(() =>
    requestHttp(
      'AFTER UPDATE CFT to FTD',
      'GET',
      `lead/64485c9504a7deeaa753f0fc`,
    ),
  ); */
/* requestHttp(
  'BEFORE UPDATE SOURCES TYPE',
  'GET',
  `traffic/64485c8a04a7deeaa753f035`,
)
  .then(() =>
    requestHttp(
      'UPDATE SOURCES TYPE',
      'PATCH',
      `affiliate/block-traffic/source-type`,
      [
        {
          sourcesType: ['64485b3704a7deeaa753d320', '64485b3704a7deeaa753d321'],
          id: '64485c8b04a7deeaa753f037',
        },
      ],
    ),
  )
  .then(() =>
    requestHttp(
      'AFTER UPDATE SOURCES TYPE',
      'GET',
      `traffic/64485c8a04a7deeaa753f035`,
    ),
  ); */

/* requestHttp('BEFORE UPDATE PARAM', 'GET', `activity/${id}`)
  .then(() =>
    requestHttp('UPDATE PARAM', 'PATCH', `activity`, {
      id,
      action: 'CREATE',
    }),
  )
  .then(() => requestHttp('AFTER UPDATE', 'GET', `activity/${id}`))
  .then(() =>
    requestHttp('ROLLBACK UPDATE PARAM', 'PATCH', `activity`, {
      id,
      action: 'LOGIN',
    }),
  )
  .then(() =>
    requestHttp('AFTER ROLLBACK UPDATE PARAM', 'GET', `activity/${id}`),
  ); */

function requestHttp(msg, method, path, auth, data = {}) {
  if (typeof auth !== 'boolean') {
    data = auth;
    auth = true;
  }
  msg = `${method} ${msg}`;
  headersRequest = headers ?? {};
  console.log(headersRequest);
  const opts = {
    protocol: protocol,
    host: host,
    method: method,
    port: port ?? 80,
    path: path,
    headers: {
      ...headersRequest,
      //Authorization: authorization,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  if (auth) {
    opts.headers.Authorization = authorization;
  }
  if (method === 'PATCH' || method === 'PUT' || method === 'POST') {
    opts.data = data;
  }
  const url = `${opts.protocol}${opts.host}:${opts.port}/${opts.path}`;
  console.log(`=========== START ${msg} ${url} \n
  ${JSON.stringify(opts)}\n
  ${url}\n
  `);
  return fetch(`${opts.protocol}${opts.host}${opts.port}/${opts.path}`, {
    method: opts.method,
    body: JSON.stringify(opts.data),
    headers: opts.headers,
  })
    .then((res) => {
      console.log(`=========== STATUS CODE ${msg} ${res.status}\n`);
      return res.json();
    })
    .then((data) =>
      console.log(`=========== END ${msg} \n${JSON.stringify(data)}\n`),
    )
    .catch((err) => console.log(`=========== ERROR ${msg} \n${url} \n${err}\n`))
    .finally(() => console.log(`=========== FINALLY ${url} \n`));
}
