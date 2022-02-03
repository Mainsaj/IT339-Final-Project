import axios from 'axios';
import 'dotenv/config';

const apiUser = 'admin';
const key = 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF';

export async function check(username, password) {
  return axios.post(`http://${process.env.HOST}:${process.env.USERS_PORT}/user/check/`+ username, {
    username: username,
    password: password
  }, {
    auth: {
      username: apiUser,
      password: key
    },
  })
}

export async function find(username) {
  return axios.get(`http://${process.env.HOST}:${process.env.USERS_PORT}/user/` + username, {
    auth: {
      username: apiUser,
      password: key
    },
  })
}

