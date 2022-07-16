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

			web3.eth.sendTransaction({
				from:window.ethereum.selectedAddress,
				to: EventWallet,
				value: AmountinFull
			}, async (err, transactionId) => {
				if (err) {
					console.log('Payment failed', err)
				} else {
					console.log('Payment successful', transactionId)


					activateWorkingModal("A moment please")
					const expectedBlockTime = 1000;
					let transactionReceipt = null
					while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
						transactionReceipt = await web3.eth.getTransactionReceipt(transactionId);
						await sleep(expectedBlockTime)
					}
		
					const Raised = Number(await contract.getEventRaised(eventId)) + Number(convertedDefaultAmount);
		
					activateWorkingModal("Done! Please confirm Updating Raised...")
		
					const result2 = await contract._setEventRaised(Number(eventId), Raised.toString());
					activateWorkingModal("A moment please")
					transactionReceipt = null;
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
		

				}
			})

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
