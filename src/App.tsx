import { useEffect, useState } from 'react'
import './App.css'
import { PeraWalletConnect } from '@perawallet/connect-beta';

const peraWallet = new PeraWalletConnect({
	projectId: 'fcfde0713d43baa0d23be0773c80a72b',
});

function App() {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
	const isConnectedToPeraWallet = !!accountAddress;

	useEffect(() => {
		// Reconnect to the session when the component is mounted
		peraWallet
			.reconnectSession()
			.then((accounts) => {
				peraWallet?.client?.on('session_delete', handleDisconnectWalletClick);

				if (accounts.length) {
					setAccountAddress(accounts[0]);
				}
			})
			.catch((e) => console.log(e));
	}, []);

	return (
		<button
			onClick={
				isConnectedToPeraWallet
					? handleDisconnectWalletClick
					: handleConnectWalletClick
			}
		>
			{isConnectedToPeraWallet ? 'Disconnect' : 'Connect to Pera Wallet'}
		</button>
	);

	function handleConnectWalletClick() {
		peraWallet
			.connect()
			.then((newAccounts) => {
				peraWallet?.client?.on('session_delete', handleDisconnectWalletClick);

				setAccountAddress(newAccounts[0]);
			})
			.catch((error) => {
				if (error?.data?.type !== 'CONNECT_MODAL_CLOSED') {
					console.log(error);
				}
			});
	}

	function handleDisconnectWalletClick() {
		peraWallet.disconnect();

		setAccountAddress(null);
	}
}

export default App
