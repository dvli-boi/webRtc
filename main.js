let APP_ID = "fe748e63e64c4375bb537fe7e247ce27";
let token = null;
let uid = String(Math.floor(Math.random() * 1000000));
let client;
let channel;
let localStream;
let remoteStream;
let peerConnection;

const servers = {
  iceServers: [
    {
      urls: ["stun:stun3.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};

let handleUserJoin = async (MemberID) => {
  console.log({ MemberID });
};

// ask for permission
let init = async () => {
  // localStream = await navigator.mediaDevices.getDisplayMedia({
  //   audio: false,
  //   video: true,
  // });
  client = await AgoraRTM.createInstance(APP_ID);
  await client.login({ uid, token });

  channel = client.createChannel("main");
  await channel.join();
  console.log("channel joined");
  channel.on("MemberJoined", handleUserJoin);

  localStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  document.getElementById("user-1").srcObject = localStream;
  createOffer();
};

let createOffer = async () => {
  peerConnection = new RTCPeerConnection(servers);

  remoteStream = new MediaStream();
  document.getElementById("user-2").srcObject = remoteStream;

  // add a new track to the connect after getting it from the localStream (mediaStream)
  localStream.getTracks().forEach((track) => {
    // track is an instance of mediaStream gives you info about the machine you are using
    peerConnection.addTrack(track, localStream);
  });

  // tracking the connection
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      return remoteStream.addTrack();
    });
  };

  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      console.log("new icce baby", event);
    }
  };

  let offer = await peerConnection
    .createOffer()
    .then((offer) => peerConnection.setLocalDescription(offer));
};
init();

// toggle camera
// function toggleCamera() {
//   const newFacingMode =
//     localStream.getVideoTracks()[0].getSettings().facingMode === "user"
//       ? "environment"
//       : "user";

//   localStream
//     .getVideoTracks()[0]
//     .applyConstraints({ facingMode: newFacingMode })
//     .then(() => {
//       console.log(`Camera facing mode changed to ${newFacingMode}`);
//     })
//     .catch((error) => {
//       console.error(`Error changing camera facing mode: ${error}`);
//     });
// }
