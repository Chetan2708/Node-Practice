const fs = require("fs");

const userNames = {};

function setUserNames(socket, userName) {
    
  userNames[userName] = {
    data: { userName: userName },
    connection: socket,
  };

  return userNames[userName];
}

function getUser(userName) {
  return userNames[userName];
}
function updateUserdb(userName, userData) {
  const user = getUser(userName);

  if (user) {
    user.data.nickname = userData.nickname;
    setUserNames(user.connection, user);
  }

}

module.exports = {
  setUserNames: setUserNames,
  getUser: getUser,
  updateUserdb: updateUserdb,
};
 