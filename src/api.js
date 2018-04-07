import Promise from 'bluebird';
import Cookie from 'js-cookie';
import { BigNumber } from 'bignumber.js';
import web3 from '@/web3';
import * as config from '@/config';
import request from 'superagent';
import timeout from 'timeout-then';
import cryptoWaterMarginABI from './abi/cryptoWaterMargin.json';
import convertContractABI from './abi/convertContract.json';

// Sometimes, web3.version.network might be undefined,
// as a workaround, use defaultNetwork in that case.
const network = config.network[web3.version.network] || config.defaultNetwork;
const cryptoWaterMarginContract = web3.eth.contract(cryptoWaterMarginABI).at(network.contract);

// This contract supposed to convert CWM to Lucky
const convertContract = web3.eth.contract(convertContractABI).at(network.convert);

let store = [];
let isInit = false;


export const init = async () => {
  await request
    .get('https://api.leancloud.cn/1.1/classes/ad')
    .set({
      'X-LC-Id': 'R6A46DH2meySCVNM1uWOoW2M-gzGzoHsz',
      'X-LC-Key': '8R6rGgpHa0Y9pq8uO53RAPCB',
    })
    .type('json')
    .accept('json')
    .then((response) => {
      if (response.body && response.body.results) {
        store = response.body.results;
      }
      isInit = true;
    });
};

init().then();

export const getMe = async () => {
  if (!window.web3) {
    throw Error('NO_METAMASK');
  }
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((error, accounts) => {
      const address = accounts[0];
      if (address) {
        return resolve({ address });
      }
      return reject(new Error('METAMASK_LOCKED'));
    });
  });
};

export const getAnnouncements = async () => {
  const response = await request
    .get('https://api.leancloud.cn/1.1/classes/announcement')
    .set({
      'X-LC-Id': 'R6A46DH2meySCVNM1uWOoW2M-gzGzoHsz',
      'X-LC-Key': '8R6rGgpHa0Y9pq8uO53RAPCB',
    })
    .type('json')
    .accept('json');

  if (response.body && response.body.results) {
    return response.body.results;
  }

  return [];
};

export const getGg = async (id, time = 0) => {
  if (!isInit) {
    return timeout((time + 1) * 500).then(() => getGg(id, time + 1));
  }

  const item = store.find(x => x.id === `${id}`);

  if (item && item.str) {
    return item.str;
  }

  return '';
};

export const setGg = async (id, str) => {
  const response = await request
    .get('https://api.leancloud.cn/1.1/classes/ad')
    .set({
      'X-LC-Id': 'R6A46DH2meySCVNM1uWOoW2M-gzGzoHsz',
      'X-LC-Key': '8R6rGgpHa0Y9pq8uO53RAPCB',
    })
    .type('json')
    .accept('json');
  if (response.body && response.body.results) {
    store = response.body.results;
  }
  const item = store.find(x => x.id === `${id}`);

  if (item) {
    // update request
    await request
      .put(`https://api.leancloud.cn/1.1/classes/ad/${item.objectId}`)
      .set({
        'X-LC-Id': 'R6A46DH2meySCVNM1uWOoW2M-gzGzoHsz',
        'X-LC-Key': '8R6rGgpHa0Y9pq8uO53RAPCB',
      })
      .type('json')
      .accept('json')
      .send({
        str,
      });
    // update store
    item.str = str;
  } else {
    // create request
    await request
      .post('https://api.leancloud.cn/1.1/classes/ad')
      .set({
        'X-LC-Id': 'R6A46DH2meySCVNM1uWOoW2M-gzGzoHsz',
        'X-LC-Key': '8R6rGgpHa0Y9pq8uO53RAPCB',
      })
      .type('json')
      .accept('json')
      .send({
        id: `${id}`,
        str,
      });
    // update store
    await init();
  }

  return str;
};

// 获取此卡片的推荐nextPrice，需要和卡片blockchain上的nextPrice进行比较，选择较大的创建交易
export const getNextPrice = async (id, time = 0) => {
  if (!isInit) {
    if (time >= 1500) {
      return 0;
    }

    return timeout((time + 1) * 500).then(() => getNextPrice(id, time + 1));
  }

  const item = store.find(x => x.id === `${id}`);

  if (item && item.nextPrice) {
    // Convert nextPrice from 'ether' to 'wei'
    return web3.toWei(item.nextPrice, 'ether');
  }

  return 0;
};

// price为用户成功发起交易的交易价格，调用setNextPrice后，nextPrice会变为此价格的1.1倍
export const setNextPrice = async (id, priceInWei) => {
  // Convert price(Wei) to a number instance (ether)
  const price = Number(web3.fromWei(priceInWei, 'ether').toString());
  const response = await request
    .get('https://api.leancloud.cn/1.1/classes/ad')
    .set({
      'X-LC-Id': 'R6A46DH2meySCVNM1uWOoW2M-gzGzoHsz',
      'X-LC-Key': '8R6rGgpHa0Y9pq8uO53RAPCB',
    })
    .type('json')
    .accept('json');
  if (response.body && response.body.results) {
    store = response.body.results;
  }
  const item = store.find(x => x.id === `${id}`);

  if (item) {
    if (price <= item.nextPrice) {
      return item.nextPrice;
    }

    // update request
    await request
      .put(`https://api.leancloud.cn/1.1/classes/ad/${item.objectId}`)
      .set({
        'X-LC-Id': 'R6A46DH2meySCVNM1uWOoW2M-gzGzoHsz',
        'X-LC-Key': '8R6rGgpHa0Y9pq8uO53RAPCB',
      })
      .type('json')
      .accept('json')
      .send({
        nextPrice: price * 1.1,
      });
    // update store
    item.nextPrice = price * 1.1;
  } else {
    // create request
    await request
      .post('https://api.leancloud.cn/1.1/classes/ad')
      .set({
        'X-LC-Id': 'R6A46DH2meySCVNM1uWOoW2M-gzGzoHsz',
        'X-LC-Key': '8R6rGgpHa0Y9pq8uO53RAPCB',
      })
      .type('json')
      .accept('json')
      .send({
        id: `${id}`,
        nextPrice: price * 1.1,
      });
    // update store
    await init();
  }

  return price * 1.1;
};

export const getItem = async (id) => {
  const exist = await Promise.promisify(cryptoWaterMarginContract.tokenExists)(id);
  if (!exist) return null;
  const card = config.cards[id] || {};
  const item = {
    id,
    name: card.name,
    nickname: card.nickname,
  };
  [item.owner, item.price, item.nextPrice] =
    await Promise.promisify(cryptoWaterMarginContract.allOf)(id);

  // [[item.owner, item.price, item.nextPrice], item.estPrice] = await Promise.all([
  //   Promise.promisify(cryptoWaterMarginContract.allOf)(id),
  //   getNextPrice(id)]);
  // item.price = BigNumber.maximum(item.price, item.estPrice);
  return item;
};

export const buyItem = (id, price) => new Promise((resolve, reject) => {
  cryptoWaterMarginContract.buy(id, {
    value: price, // web3.toWei(Number(price), 'ether'),
    gas: 220000,
    gasPrice: 1000000000 * 100,
  },
  (err, result) => (err ? reject(err) : resolve(result)));
});

// Lucky Part
export const exchangeLuckyToken = tokenId => new Promise((resolve, reject) => {
  convertContract.getNewToken(tokenId, {
    value: 0, // web3.toWei(Number(price), 'ether'),
    gas: 80000,
    gasPrice: 1000000000 * 18,
  },
  (err, result) => (err ? reject(err) : resolve(result)));
});

export const isConvert = cardId => new Promise((resolve, reject) => {
  convertContract.isConvert(cardId,
    (err, result) => (err ? reject(err) : resolve(result)));
});

export const getTotal = () => Promise.promisify(cryptoWaterMarginContract.totalSupply)();

export const getItemIds = async (offset, limit) => {
  let ids = await Promise.promisify(cryptoWaterMarginContract.itemsForSaleLimit)(offset, limit);
  ids = ids.map(id => id.toNumber());
  ids.sort((a, b) => a - b);
  return Array.from(new Set(ids));
};

export const isItemMaster = async (id) => {
  const me = await getMe();
  const item = await getItem(id);

  return me && me.address && item && item.owner && me.address === item.owner;
};

export const getItemsOf = async (address) => {
  let ids = await Promise.promisify(
    cryptoWaterMarginContract.tokensOf)(address)
    ;
  ids = ids.map(id => id.toNumber());
  ids.sort((a, b) => a - b);
  return Array.from(new Set(ids));
};

export const getNetwork = async () => {
  const netId = await Promise.promisify(web3.version.getNetwork)();
  return config.network[netId];
};

export const getLocale = async () => (
  Cookie.get('locale') ||
  (
    navigator.language ||
    navigator.browserLanguage ||
    navigator.userLanguage
  ).toLowerCase()
);

export const setLocale = async (locale) => {
  Cookie.set('locale', locale, { expires: 365 });
};
