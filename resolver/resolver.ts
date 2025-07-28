
const ETH_DATA = {
    srcEscrowAddress: "0x",
    immutables: {},
    near_user_id: "",
    near_hashlock: "",
    near_amount: "1"

}

async function main(){
  console.log('--- Starting Resolver Script ---');

    console.log('\n--- Step 1: Locking funds on NEAR ---');
    await lockFundsOnNear(ETH_DATA.near_user_id,ETH_DATA.near_hashlock,ETH_DATA.near_amount)

      console.log('\n--- Step 2: Watching for secret on NEAR to claim on Ethereum ---');

      const interval = setInterval(async ()=> {
        const secret = awaitForSecretOnNear()
        if(secret){
            clearInterval(interval)
            await claimFundsOnEth(ETH_DATA.srcEscrowAddress, secret, ETH_DATA.immutables)
        }
      },15000)
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});