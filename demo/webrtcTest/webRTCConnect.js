let pc;
const constraints = { audio: true, video: { width: 1280, height: 720 } };
let signaling;
window.addEventListener('load', async () => {
  signaling = await initSocket();
  const $remoteVideo = document.querySelector('#remoteVideo');
  $remoteVideo.onloadedmetadata = () => {
    $remoteVideo.play();
  }
  pc = initPeerConnection({ signaling, $remoteVideo });
  getMedia({
    $video: document.querySelector('#myVideo'),
    constraints,
    pc
  });
});

function initSocket() {
  const socket = io.connect('/', {
    path: '/test',
    'transports': ['websocket'],
  });
  return new Promise(resolve => {
    socket.on('connect', () => {
      console.log('socket connect success');
      socket.on('message', async ({ desc, candidate }) => {
        try {
          if (desc) {
            // if we get an offer, we need to reply with an answer
            if (desc.type == 'offer') {
              await pc.setRemoteDescription(desc);
              const stream = await navigator.mediaDevices.getUserMedia(constraints);
              stream.getTracks().forEach((track) => pc.addTrack(track, stream));
              await pc.setLocalDescription(await pc.createAnswer());
              signaling.send({ desc: pc.localDescription });
            } else if (desc.type == 'answer') {
              await pc.setRemoteDescription(desc);
            } else {
              console.log('Unsupported SDP type. Your code may differ here.');
            }
          } else if (candidate) {
            await pc.addIceCandidate(candidate);
          }
        } catch (err) {
          console.error(err);
        }
      });
      resolve({
        send(msg) {
          socket.emit('message', msg);
        }
      });
    });
  });
}

function getMedia({ $video, constraints, pc }) {
  return navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    $video.srcObject = stream;
    $video.onloadedmetadata = () => {
      $video.play();
    }
    return stream;
  }).catch(err => {
    console.error(`${err.name}:${err.message}`);
  });
}

function initPeerConnection({ signaling, $remoteVideo }) {
  const pc = createPeerConnection({
    iceServers: [{
      "urls": [
        "turn:13.250.13.83:3478?transport=udp"
      ],
      "username": "YzYNCouZM1mhqhmseWk6",
      "credential": "YzYNCouZM1mhqhmseWk6"
    }]
  });

  // send any ice candidates to the other peer
  pc.onicecandidate = ({ candidate }) => signaling.send({ candidate });

  // let the "negotiationneeded" event trigger offer generation
  pc.onnegotiationneeded = async () => {
    try {
      await pc.setLocalDescription(await pc.createOffer());
      // send the offer to the other peer
      signaling.send({ desc: pc.localDescription });
    } catch (err) {
      console.error(err);
    }
  };

  // once media for a remote track arrives, show it in the remote video element
  pc.ontrack = (event) => {
    // don't set srcObject again if it is already set.
    if ($remoteVideo.srcObject) return;
    $remoteVideo.srcObject = event.streams[0];
  };

  return pc;
}

function createPeerConnection(config, optional) {
  if (window.RTCPeerConnection) return new RTCPeerConnection(config, optional);
  else if (window.webkitRTCPeerConnection) return new webkitRTCPeerConnection(config, optional);
  else if (window.mozRTCPeerConnection) return new mozRTCPeerConnection(config, optional);
  throw new Error("RTC Peer Connection not available");
}