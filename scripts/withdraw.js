const hre = require("hardhat")
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json")

async function getBalance(provider, address) {
    const balanceBigInt = await provider.getBalance(address)
    return hre.ethers.utils.formatEther(balanceBigInt)
}

async function main() {
    //Get the contract that has been deployed to Goerli
    const contractAddress = "0x554050a44e2c00518C1A6f10aF3A9502B528E353"
    const contractABI = abi.abi

    //Get the node connection and wallet connection
    const provider = new hre.ethers.providers.AlchemyProvider("goerli", process.env.GOERLI_API_KEY)

    // Ensure that signer is the Same address as the original contract deployer,
    // or else this script will fail with an error.
    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider)

    // Instantiate connected contract.
    const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer)

    // Check starting balances.
    console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH")
    const contractBalance = await getBalance(provider, buyMeACoffee.address)
    console.log(
        "current balance of a contract:",
        await getBalance(provider, buyMeACoffee.address),
        "ETH"
    )

    // Withdraw funds if there are funds to Withdraw
    if (contractBalance !== "0.0") {
        console.log("withdrawing funds...")
        const withdrawTxn = await buyMeACoffee.withdrawTips()
        await withdrawTxn.wait()
    } else {
        console.log("no funds to withdraw!")
    }

    // Check ending balance
    console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH")
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
