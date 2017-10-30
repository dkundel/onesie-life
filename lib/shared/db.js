const twilio = require('twilio');
const argon2 = require('argon2');
const marked = require('marked');
const { escape } = require('querystring');

const { TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET } = process.env;
const client = twilio(TWILIO_API_KEY, TWILIO_API_SECRET, { accountSid: TWILIO_ACCOUNT_SID });
const serviceSid = process.env.TWILIO_SYNC_SERVICE || 'default';
const sync = client.sync.services(serviceSid);

const DB_NAMES = {
  POSTS: 'posts',
  USERS: 'users'
};

async function init() {
  // this just tries to get the respective element and else creates it
  try {
    await sync.syncLists(DB_NAMES.POSTS).fetch();
  } catch (err) {
    await sync.syncLists.create({ uniqueName: DB_NAMES.POSTS });
  }

  try {
    await sync.syncMaps(DB_NAMES.USERS).fetch();
  } catch (err) {
    await sync.syncMaps.create({ uniqueName: DB_NAMES.USERS });
  }

  return true;
}

async function getPosts() {
  return (await sync
    .syncLists(DB_NAMES.POSTS)
    .syncListItems.list({ order: 'desc' })).map(x => x.data);
}

async function createPost(name, message) {
  message = marked(message, { sanitize: true });

  const data = { message, name };
  await sync.syncLists(DB_NAMES.POSTS).syncListItems.create({ data });
  return data;
}

async function createUser(username, password, role) {
  // this will automatically salt the password and store the password as part of the hash
  // as recommended in https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet
  const hash = await argon2.hash(password);
  const data = { username, hash, role };

  await sync
    .syncMaps(DB_NAMES.USERS)
    .syncMapItems.create({ key: username, data });

  return { username, role };
}

async function authenticateUser(username, password) {
  let item;
  try {
    item = await sync
      .syncMaps(DB_NAMES.USERS)
      .syncMapItems(escape(username))
      .fetch();
  } catch (err) {
    console.error(err);
    return null;
  }

  const userData = item.data;
  const passwordIsCorrect = await argon2.verify(userData.hash, password);

  if (!passwordIsCorrect) {
    return null;
  }
  return { role: userData.role, username };
}

module.exports = { init, getPosts, createPost, createUser, authenticateUser };
