module.exports = (nightmare) => {
  const loginUrl = 'https://cpcdi.pt/Account/Login';

  const authData = {
    clientCode: process.env.CPCDI_CLIENT_CODE,
    user: process.env.CPCDI_USER,
    password: process.env.CPCDI_password
  };

  return nightmare
    .viewport(1024, 800)
    .goto(loginUrl)
    .type('#CodCliente', authData.clientCode)
    .wait(400)
    .type('#UserName', authData.user)
    .wait(400)
    .type('#Password', authData.password)
    .wait(400)
    .click('button[type=submit]')
    .wait(1500)
    .then(() => {
      console.log('Ready to serve requests')
    });
};