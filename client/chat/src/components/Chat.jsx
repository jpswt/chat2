import React, { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({ socket, username, room }) {
	const [msg, setMsg] = useState('');
	const [msgList, setMsgList] = useState([]);

	const sendMsg = async () => {
		if (msg !== '') {
			const msgData = {
				room: room,
				user: username,
				message: msg,
			};
			await socket.emit('send_message', msgData);
			setMsgList((list) => [...list, msgData]);
			setMsg('');
		}
	};

	useEffect(() => {
		socket.on('receive_message', (data) => {
			setMsgList((list) => [...list, data]);
		});
	}, [socket]);

	return (
		<div className="relative flex flex-col h-full justify-center items-center">
			<div className=" w-[30rem] py-2 bg-neutral-700 text-white rounded-t-md text-center text-xl font-bold  ">
				Coffee Chat Room
			</div>
			<div className="w-[30rem] h-[20rem] bg-white text-stone-900 border-2 border-black border-t-0 pb-2">
				<ScrollToBottom className=" w-full h-full overflow-x-hidden overflow-y-scroll">
					{msgList.map((msgText, index) => (
						<div>
							<div
								id={username === msgText.user ? 'you' : 'them'}
								key={index}
								className="flex flex-col"
							>
								<div className="ml-3 mb-1 text-black font-semibold">
									<p>{msgText.user}</p>
								</div>
								<div>
									<div className=" bg-sky-500 w-fit max-w-[14rem] px-4 py-2 rounded-lg ml-2 mt-1 mb-2 text-white font-bold break-words overflow-x-hidden">
										<p>{msgText.message}</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</ScrollToBottom>
			</div>
			<div className="w-[30rem] h-[3rem] bg-white text-stone-700 border-2 border-black border-t-0 flex justify-between">
				<input
					className="mx-2 my-2 w-full outline-none "
					type="text"
					value={msg}
					placeholder="Type Text"
					onChange={(e) => {
						setMsg(e.target.value);
					}}
					onKeyUp={(e) => {
						e.key === 'Enter' && sendMsg();
					}}
				/>
				<button
					onClick={sendMsg}
					className=" text-lg border-l-2 border-black px-2 bg-cyan-600 text-white hover:bg-cyan-400 "
				>
					Send
				</button>
			</div>
		</div>
	);
}

export default Chat;
