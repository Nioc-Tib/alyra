const Web3 = require("web3");
const rpcURL =
  "https://ropsten.https://mainnet.infura.io/v3/85e219353b5a400182993b3290812401";
const web3 = new Web3(rpcURL);
const ABI = require("./api.json");
const BTUaddress = "0xb683d83a532e2cb7dfa5275eed3698436371cc9f";
const BTU = new web3.eth.Contract(ABI.result, BTUaddress);

async function loadWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum); // permet d’initialiser l’objet Web3 en se basant sur le provider injecté dans la page web
    await window.ethereum.enable(); //demande à Metamask de laisser la page web accéder à l’objet web3 injecté
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider); // si l’objet web3 existe déjà, l’objet Web3 est initialisé en se basant sur le provider du web3 actuel
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    ); // message d’erreur si le navigateur ne détecte pas Ethereum
  }
}

BTU.methods
  .balanceOf("0xd804ab1667e940052614a5acd103dde4d298ce36")
  .call((err, data) => {
    console.log(data);
  });
