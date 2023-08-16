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

// ask for permission
let init = async () => {
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
    peerConnection.addTrack(track, localStream);
  });

  // tracking the comm
  peerConnection.ontrack = (event) => {
    console.log("trackedddddd");
    event.streams[0].getTracks().forEach((track) => {
      console.log(treck);
      return remoteStream.addTrack();
    });
  };

  console.log(peerConnection);
  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
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
