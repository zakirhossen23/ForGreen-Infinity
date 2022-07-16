import { ethers } from 'ethers';

const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export default async function send_token(
	send_token_amount,
	to_address,
	private_key
) {
	const provider = new ethers.providers.JsonRpcProvider("https://rpc.api.moonbase.moonbeam.network")

	const walletSigner = new ethers.Wallet(private_key, provider);

	let gas_price = ethers.utils.hexlify(parseInt(1000000))
	console.log(`gas_price: ${gas_price}`)
	
	let send_account = await walletSigner.getAddress();
	console.log(send_token_amount)
	const tx = {
		from: send_account,
		to: to_address,
		value: ethers.utils.parseEther(send_token_amount),
	}
	let transaction= await walletSigner.sendTransaction(tx);
	let transactionReceipt = null
	while (transactionReceipt == null) {
		transactionReceipt = await provider.waitForTransaction(transaction.hash);
		await sleep(1000)
	}
	return send_account;
}