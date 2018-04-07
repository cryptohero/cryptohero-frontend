import blockies from 'ethereum-blockies-png';

const getIconFromWallet = address => blockies.createDataURL({ seed: address, scale: 10 });

export default getIconFromWallet;
