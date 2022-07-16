import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import UseFormInput from '../UseFormInput';

export default function BidNFTModal({
	show,
	onHide,
	contract,
	senderAddress,
	tokenId,
	eventId,
	toAddress,
	type,
	Highestbid

}) {
	const [Alert, setAlert] = useState('');

	const Web3 = require("web3")

	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}


	const [Amount, AmountInput] = UseFormInput({
		type: 'text',
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

	async function bidNFT() {
		
		var BidNFTBTN = document.getElementById("bidNFTBTN")
		BidNFTBTN.disabled = true;
		console.log("bidding")
		if (Number(Amount) < Number(Highestbid)) {
			activateWarningModal(`Amount cannot be under ${Highestbid} LINK`);
			return;
		} else {
			var alertELM = document.getElementById("alert");
			alertELM.style.display = 'none';
		}
		try {
			activateWorkingModal("Bidding....")

			const Web3 = require("web3")
			const web3 = new Web3(window.ethereum)
			let AmountinFull = (Number(Amount) * 1000000000000000000).toLocaleString('fullwide', { useGrouping: false });
			activateWorkingModal("A moment please")
			
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
            const address = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709';
            const contract2 = new web3.eth.Contract(ABI,address);
			console.log(contract2);
			const contractData = await contract2.methods.transfer(toAddress,(AmountinFull) ).send({from: senderAddress,  gasPrice: 10000000000, gasLimit:400000});

			activateWorkingModal("Done! Adding into Moonbeam Network...")

			const tokenUri = await contract.tokenURI(tokenId);
			var parsed = await JSON.parse(tokenUri);
			if (Number(parsed['properties']['price']['description']) < Number(Amount)) {
				parsed['properties']['price']['description'] = Amount;
				parsed['properties']['higherbidadd']['description'] = senderAddress;

			}
			let currentDate = new Date();
			const createdObject = {
				title: 'Asset Metadata Bids',
				type: 'object',
				properties: {
					username: {
						type: 'string',
						description: senderAddress
					},
					bid: {
						type: 'string',
						description: Amount
					},
					time: {
						type: 'string',
						description: currentDate
					}
				}
			};
			activateWorkingModal("Please confirm creating Bid...")
			const totalraised = await contract.getEventRaised(Number(eventId));
			let Raised = 0;
			Raised = Number(totalraised) + Number(Amount);
			console.log("doen")
			const result2 = await contract.createBid(tokenId, JSON.stringify(createdObject), JSON.stringify(parsed), eventId,Raised.toString());
			activateWorkingModal("A moment please")
			const expectedBlockTime = 1000;
			let transactionReceipt = null
			while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
				transactionReceipt = await web3.eth.getTransactionReceipt(result2.hash);
				await sleep(expectedBlockTime)
			}

			console.log(transactionReceipt);
			activateWorkingModal("Success!")
			window.document.getElementsByClassName("btn-close")[0].click();
			BidNFTBTN.disabled = false;
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
					Bid NFT
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
						<Form.Label>Bid Amount in LINK</Form.Label>
						{AmountInput}
					</Form.Group>
					<div className="d-grid">
						<Button variant="primary" id="bidNFTBTN" onClick={bidNFT}>
							Bid NFT
						</Button>

					</div>
				</Form>
			</Modal.Body>

		</Modal>

	);
}
