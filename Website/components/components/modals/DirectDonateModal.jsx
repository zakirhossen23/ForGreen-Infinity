import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import UseFormInput from '../UseFormInput';

export default function DirectDonateModal({
	show,
	onHide,
	eventId,
	contract,
	senderAddress,
	EventWallet,

}) {
	const [Alert, setAlert] = useState('');

	const Web3 = require("web3")

	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}


	const [Amount, AmountInput] = UseFormInput({
		type: 'number',
		placeholder: 'Amount',
	});

	function activateWarningModal(TextAlert) {
		var alertELM = document.getElementById("alert");
		alertELM.style = 'contents';
		setAlert(TextAlert)
	}
	function activateWorkingModal(TextAlert) {
		var alertELM = document.getElementById("workingalert");
		alertELM.style = 'contents';
		setAlert(TextAlert)
	}

	async function DonateCoin() {

		var DonateBTN = document.getElementById("DonateBTN");
		var SelectCoin = document.getElementById("stablecoin");
		DonateBTN.disabled = true;

		try {
			activateWorkingModal("Transferring....")
			const Web3 = require("web3")
			const web3 = new Web3(window.ethereum)

			let convertedDefaultAmount = Number(Amount);
			let AmountinFull = (Number(Amount) * 1000000000000000000).toLocaleString('fullwide', { useGrouping: false });
			console.log("Donating")

		
			const ABI = [				
				{
				  "constant": true,
				  "inputs": [
					{
					  "name": "_to",
					  "type": "address"
					},
					{
					  "name": "_value",
					  "type": "uint256"
					}
				  ],
				  "name": "transfer",
				  "outputs": [
					{
					  "name": "success",
					  "type": "bool"
					}
				  ],
				  "payable": false,
				  "stateMutability": "nonpayable",
				  "type": "function"
				}	
			  ];
            const address = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709'; //Chainlink contract link
            const contract2 = new web3.eth.Contract(ABI,address);
			console.log(contract2);
			const contractData = await contract2.methods.transfer(EventWallet,(AmountinFull) ).send({from: senderAddress,  gasPrice: 10000000000, gasLimit:400000});
			console.log(contractData);
			
			const Raised = Number(await contract.getEventRaised(eventId)) + Number(convertedDefaultAmount);

			activateWorkingModal("Done! Please confirm Updating Raised...")

			const result2 = await contract._setEventRaised(Number(eventId), Raised.toString());
			activateWorkingModal("A moment please")
			let transactionReceipt = null;
			while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
				transactionReceipt = await web3.eth.getTransactionReceipt(result2.hash);
				await sleep(expectedBlockTime)
			}

			console.log(transactionReceipt);
			activateWorkingModal("Success!")
			window.document.getElementsByClassName("btn-close")[0].click();
			DonateBTN.disabled = false;
			await sleep(200)
			window.location.reload();



		} catch (e) {
			console.error(e);
			activateWarningModal(`Error! Please try again!`);
			var alertELM = document.getElementById("workingalert");
			alertELM.style.display = 'none';
			return;
		}

	}
	return (
		<Modal
			show={show}
			onHide={onHide}
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Donate Coin
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="show-grid">
				<Form>
					<div id='alert' style={{ display: 'none', fontSize: "30px" }} className="alert alert-danger" role="alert">
						{Alert}
					</div>
					<div id='workingalert' style={{ display: 'none', fontSize: "30px" }} className="alert alert-success" role="alert">
						{Alert}
					</div>

					<Form.Group className="mb-3" controlId="formGroupName">
						<Form.Label>Amount</Form.Label>
						{AmountInput}
					</Form.Group>
					<div className="d-grid">
						<Button variant="primary" id="DonateBTN" onClick={DonateCoin}>
							Donate
						</Button>

					</div>
				</Form>
			</Modal.Body>

		</Modal>

	);
}
