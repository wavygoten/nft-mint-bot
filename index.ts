import { ethers } from "ethers";
import fetch from "cross-fetch";
import abi from "./abi.json";
import config from "./config.json";

class Bot {
  private provider: ethers.providers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private contract: ethers.Contract;
  private iface: ethers.utils.Interface;
  constructor(props?: any) {
    this.provider = new ethers.providers.JsonRpcProvider(config.RPC);
    this.signer = new ethers.Wallet(props.PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(config.CONTRACT, abi, this.signer);
    this.iface = new ethers.utils.Interface(abi);
  }
  start() {
    console.log("Starting Mint Bot...");
    setInterval(async () => {
      switch (config.TXN_TYPE) {
        case 0:
          let txZero: any;
          if (config.HEX_DATA.length > 0) {
            txZero = {
              from: this.signer.getAddress(),
              to: config.CONTRACT,
              value: ethers.utils.parseEther(`${config.PAYABLE_AMOUNT}`),
              nonce: this.provider.getTransactionCount(
                this.signer.getAddress(),
                "latest"
              ),
              gasPrice: ethers.utils.parseUnits(`${config.GWEI}`, "gwei"),
              gasLimit: ethers.utils.hexlify(config.GAS_LIMIT),
              data: config.HEX_DATA,
              type: config.TXN_TYPE, // legacy
            };
          } else {
            if (config.FUNCTION_DATA.length > 0) {
              txZero = {
                from: this.signer.getAddress(),
                to: config.CONTRACT,
                value: ethers.utils.parseEther(`${config.PAYABLE_AMOUNT}`),
                nonce: this.provider.getTransactionCount(
                  this.signer.getAddress(),
                  "latest"
                ),
                gasPrice: ethers.utils.parseUnits(`${config.GWEI}`, "gwei"),
                gasLimit: ethers.utils.hexlify(config.GAS_LIMIT),
                data: this.iface.encodeFunctionData(
                  config.FUNCTION_NAME,
                  config.FUNCTION_DATA
                ),
                type: config.TXN_TYPE, // legacy
              };
            } else {
              txZero = {
                from: this.signer.getAddress(),
                to: config.CONTRACT,
                value: ethers.utils.parseEther(`${config.PAYABLE_AMOUNT}`),
                nonce: this.provider.getTransactionCount(
                  this.signer.getAddress(),
                  "latest"
                ),
                gasPrice: ethers.utils.parseUnits(`${config.GWEI}`, "gwei"),
                gasLimit: ethers.utils.hexlify(config.GAS_LIMIT),
                data: this.iface.encodeFunctionData(config.FUNCTION_NAME),
                type: config.TXN_TYPE, // legacy
              };
            }
          }
          await this.signer
            .call(txZero)
            .then(async (res: any) => {
              if (res !== "0x") {
                console.log(
                  await this.hex_to_ascii(res.substr(138)),
                  "| retrying delay",
                  config.DELAY
                );
              } else {
                console.log("Sale is live, Sending transaction(s)...");
                await this.signer
                  .sendTransaction(txZero)
                  .then(async (txn: any) => {
                    console.log(`https://etherscan.io/tx/${txn?.hash}`);
                    // send webhook here
                    // await txn.wait().then(function (receipt: any) {
                    //   console.log("Transaction confirmed");
                    //   console.log(receipt);
                    // });
                    await this.sendWebhook(config.WEBHOOK, {
                      url: `https://etherscan.io/tx/${txn?.hash}`,
                    });
                    process.exit();
                  })
                  .catch((error: any) => {
                    console.error(error?.message);
                    process.exit();
                  });
              }
            })
            .catch((error: any) => {
              console.log(error.message);
            });
        case 1:
          let tx: any;
          if (config.HEX_DATA.length > 0) {
            tx = {
              from: this.signer.getAddress(),
              to: config.CONTRACT,
              value: ethers.utils.parseEther(`${config.PAYABLE_AMOUNT}`),
              nonce: this.provider.getTransactionCount(
                this.signer.getAddress(),
                "latest"
              ),
              gasPrice: ethers.utils.parseUnits(`${config.GWEI}`, "gwei"),
              gasLimit: ethers.utils.hexlify(config.GAS_LIMIT),
              data: config.HEX_DATA,
              type: config.TXN_TYPE, // legacy
            };
          } else {
            if (config.FUNCTION_DATA.length > 0) {
              tx = {
                from: this.signer.getAddress(),
                to: config.CONTRACT,
                value: ethers.utils.parseEther(`${config.PAYABLE_AMOUNT}`),
                nonce: this.provider.getTransactionCount(
                  this.signer.getAddress(),
                  "latest"
                ),
                gasPrice: ethers.utils.parseUnits(`${config.GWEI}`, "gwei"),
                gasLimit: ethers.utils.hexlify(config.GAS_LIMIT),
                data: this.iface.encodeFunctionData(
                  config.FUNCTION_NAME,
                  config.FUNCTION_DATA
                ),
                type: config.TXN_TYPE, // legacy
              };
            } else {
              tx = {
                from: this.signer.getAddress(),
                to: config.CONTRACT,
                value: ethers.utils.parseEther(`${config.PAYABLE_AMOUNT}`),
                nonce: this.provider.getTransactionCount(
                  this.signer.getAddress(),
                  "latest"
                ),
                gasPrice: ethers.utils.parseUnits(`${config.GWEI}`, "gwei"),
                gasLimit: ethers.utils.hexlify(config.GAS_LIMIT),
                data: this.iface.encodeFunctionData(config.FUNCTION_NAME),
                type: config.TXN_TYPE, // legacy
              };
            }
          }
          await this.signer
            .call(tx)
            .then(async (res: any) => {
              if (res !== "0x") {
                console.log(
                  await this.hex_to_ascii(res.substr(138)),
                  "| retrying delay",
                  config.DELAY
                );
              } else {
                console.log("Sale is live, Sending transaction(s)...");
                await this.signer
                  .sendTransaction(tx)
                  .then(async (txn: any) => {
                    console.log(`https://etherscan.io/tx/${txn?.hash}`);
                    // send webhook here
                    // await txn.wait().then(function (receipt: any) {
                    //   console.log("Transaction confirmed");
                    //   console.log(receipt);
                    // });
                    await this.sendWebhook(config.WEBHOOK, {
                      url: `https://etherscan.io/tx/${txn?.hash}`,
                    });
                    process.exit();
                  })
                  .catch((error: any) => {
                    console.error(error?.message);
                    process.exit();
                  });
              }
            })
            .catch((error: any) => {
              console.log(error.message);
            });

        case 2:
          let tx2: any;
          if (config.HEX_DATA.length > 0) {
            tx2 = {
              from: this.signer.getAddress(),
              to: config.CONTRACT,
              value: ethers.utils.parseEther(`${config.PAYABLE_AMOUNT}`),
              nonce: this.provider.getTransactionCount(
                this.signer.getAddress(),
                "latest"
              ),
              maxFeePerGas: ethers.utils.parseUnits(
                `${config.MAX_FEE_PER_GAS}`,
                "gwei"
              ),
              maxPriorityFeePerGas: ethers.utils.parseUnits(
                `${config.MAX_PRIORITY_FEE_PER_GAS}`,
                "gwei"
              ),
              gasLimit: ethers.utils.hexlify(config.GAS_LIMIT),
              data: config.HEX_DATA,
              type: config.TXN_TYPE, // eip-1559
            };
          } else {
            if (config.FUNCTION_DATA.length > 0) {
              tx2 = {
                from: this.signer.getAddress(),
                to: config.CONTRACT,
                value: ethers.utils.parseEther(`${config.PAYABLE_AMOUNT}`),
                nonce: this.provider.getTransactionCount(
                  this.signer.getAddress(),
                  "latest"
                ),
                maxFeePerGas: ethers.utils.parseUnits(
                  `${config.MAX_FEE_PER_GAS}`,
                  "gwei"
                ),
                maxPriorityFeePerGas: ethers.utils.parseUnits(
                  `${config.MAX_PRIORITY_FEE_PER_GAS}`,
                  "gwei"
                ),
                gasLimit: ethers.utils.hexlify(config.GAS_LIMIT),
                data: this.iface.encodeFunctionData(
                  config.FUNCTION_NAME,
                  config.FUNCTION_DATA
                ),
                type: config.TXN_TYPE, // eip-1559
              };
            } else {
              tx2 = {
                from: this.signer.getAddress(),
                to: config.CONTRACT,
                value: ethers.utils.parseEther(`${config.PAYABLE_AMOUNT}`),
                nonce: this.provider.getTransactionCount(
                  this.signer.getAddress(),
                  "latest"
                ),
                maxFeePerGas: ethers.utils.parseUnits(
                  `${config.MAX_FEE_PER_GAS}`,
                  "gwei"
                ),
                maxPriorityFeePerGas: ethers.utils.parseUnits(
                  `${config.MAX_PRIORITY_FEE_PER_GAS}`,
                  "gwei"
                ),
                gasLimit: ethers.utils.hexlify(config.GAS_LIMIT),
                data: this.iface.encodeFunctionData(config.FUNCTION_NAME),
                type: config.TXN_TYPE, // legacy
              };
            }
          }

          await this.signer
            .call(tx2)
            .then(async (res: any) => {
              if (res !== "0x") {
                console.log(
                  await this.hex_to_ascii(res.substr(138)),
                  "| retrying delay",
                  config.DELAY
                );
              } else {
                console.log("Sale is live, Sending transaction(s)...");
                await this.signer
                  .sendTransaction(tx2)
                  .then(async (txn: any) => {
                    console.log(`https://etherscan.io/tx/${txn?.hash}`);
                    // send webhook here
                    // await txn.wait().then(function (receipt: any) {
                    //   console.log("Transaction confirmed");
                    //   console.log(receipt);
                    // });
                    await this.sendWebhook(config.WEBHOOK, {
                      url: `https://etherscan.io/tx/${txn?.hash}`,
                    });
                    process.exit();
                  })
                  .catch((error: any) => {
                    console.error(error?.message);
                    process.exit();
                  });
              }
            })
            .catch((error: any) => {
              console.log(error.message);
            });

          break;
        default:
          console.log(
            "Please specify txn type in config.json 0 for legacy, 1 for upgraded legacy, or 2 for eip-1559"
          );
          setTimeout(() => {}, 5000);
          process.exit();
      }
    }, config.DELAY * 1000);
  }
  async sendWebhook(url: string, details: any) {
    const embed = {
      embeds: [
        {
          color: 2123412,
          title: "Created TXN",
          url: details.url,
          description: "Good luck",
          footer: {
            text: "Gotens Mint Bot",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(embed),
    });
  }
  async sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  async hex_to_ascii(str1: any) {
    var hex = str1.toString();
    var str = "";
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }
}

for (let i = 0; i < config.PRIVATE_KEY.length; i++) {
  new Bot({ PRIVATE_KEY: config.PRIVATE_KEY[i] }).start();
}
