import { Component, OnInit } from '@angular/core';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';


declare global {
  interface Navigator {
    attachMediaStream: any;
  }
}

@Component({
  selector: 'app-dolby-poc',
  templateUrl: './dolby-poc.page.html',
  styleUrls: ['./dolby-poc.page.scss'],
})
export class DolbyPocPage implements OnInit {
  // --  start
  token: string;
  // eslint-disable-next-line max-len
  sampleToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkb2xieS5pbyIsImlhdCI6MTY2NTY1NDMwMCwic3ViIjoibHFiMGJoN2FuNzc5bmhpUklzZVVEQT09Iiwic2NvcGUiOiJzZXNzaW9uIiwib2lkIjoiY2MzNTNkYzYtMmM5ZC00Y2RjLTk0NDMtNzU4ODIwMWUzNzY4IiwiYmlkIjoiOGEzNjhmNWE4MzVhMjY5ODAxODM1ZTZjMTI0MjdiN2IiLCJhaWQiOiI5MDA3ZGM5ZS05YjU5LTRiYTAtYjdjNy01OGMwNWM2ZWQ2OWIiLCJhdXRob3JpdGllcyI6WyJST0xFX0NVU1RPTUVSIl0sImV4cCI6MTY2NTY5NzUwMH0.vFv_QBSx0K6P1Eu2NnTToOBDFYa_wozqlsB823rATgifC8iUzUksBeDeG-2TSrZ6WiLmR1ccu92Ki_D8P6v1Qg';

  authenticate() {
    const tmp: any = document.getElementById('input-token');
    if (tmp.value.length > 400) {
      this.token = tmp.value;
      this.main();
    }
  }

  shareMessage = (message) => {
    document.getElementById('message').innerText = message;
  };

  initializeToken = () => {
    // eslint-disable-next-line max-len
    // debugger;
    VoxeetSDK.initializeToken(this.token, () => { });
    this.shareMessage('Step 1: Web SDK initialized.');
    return this.token;
  };

  openSession = async (sessionName) => {
    try {
      await VoxeetSDK.session.open({ name: sessionName });
      this.shareMessage('Step 2: Session opened.');
    } catch (error) {
      this.shareMessage(`Error opening session: ${error}`);
    }
  };

  createAndJoinConference = async (conferenceAlias, participantName) => {
    if (!VoxeetSDK.session.isOpen()) { await this.openSession(participantName); };
    const joinOptions = {
      constraints: { audio: true, video: true }
    };
    const conferenceOptions = {
      alias: conferenceAlias
    };
    try {
      const conference = await VoxeetSDK.conference.create(conferenceOptions);
      await VoxeetSDK.conference.join(conference, joinOptions);
      this.shareMessage(`Step 3: Conference '${conferenceAlias}' created and joined.`);
      // eslint-disable-next-line no-empty
    } catch (error) {
    }
  };

  handleConferenceFlow = () => {
    VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
      if (stream.type === 'Camera') {
        this.shareVideo(participant, stream);
      }
    });
    VoxeetSDK.conference.on('streamUpdated', (participant, stream) => {
      if (stream.type === 'Camera' && stream.getVideoTracks().length) {
        this.shareVideo(participant, stream);
      }
    });
    VoxeetSDK.conference.on('streamRemoved', (participant, stream) => {
      const videoNode = document.getElementById(`video-${participant.id}`);
      if (videoNode) {
        videoNode.parentNode.removeChild(videoNode);
      }
    });
    VoxeetSDK.conference.on('left', async () => {
      await VoxeetSDK.session.close();
    });
  };

  shareVideo = (participant, stream) => {
    let perspective = 'self-view';
    if (VoxeetSDK.session.participant.id !== participant.id) {
      perspective = 'remote-view';
    }
    let videoNode: any = document.getElementById(`video-${participant.id}`);
    // eslint-disable-next-line no-empty
    if (videoNode) {
    } else {
      videoNode = document.createElement('video');
      videoNode.setAttribute('id', `video-${participant.id}`);
      videoNode.setAttribute('height', '100%');
      videoNode.setAttribute('width', '100%');
      videoNode.muted = true;
      videoNode.autoplay = true;
      videoNode.playsinline = true;
      const videoContainer: any = document.getElementById(perspective);
      videoContainer.lastElementChild.replaceWith(videoNode);
      videoContainer.firstElementChild.innerText = participant.info.name;
    }
    navigator.attachMediaStream(videoNode, stream);
    this.shareMessage(`Step 4: Video of participant '${participant.info.name}' started.`);
  };

  leaveConference = async () => {
    try {
      await VoxeetSDK.conference.leave();
      this.shareMessage('Getting Started Success: Conference has ended.');
      // eslint-disable-next-line no-empty
    } catch (error) {
    }
  };

  async main() {
    const queryParams = new URLSearchParams(window.location.search);
    const name = queryParams.get('name') || 'developer';
    const alias = queryParams.get('alias') || 'web-sdk-starter';
    const token = this.initializeToken();
    await this.openSession(name);
    document.getElementById('btn-join').onclick = async () => {
      await this.createAndJoinConference(alias, name);
    };
    this.handleConferenceFlow();
    document.getElementById('btn-invite').onclick = () => {
      const url = `https://developer.dolby.io/demos/comms-sdk-web-getting-started/index.html?token=${token}&alias=${alias}&name=guest`;
      this.shareMessage(`Share the URL copied to your browser clipboard: ${url}`);
      navigator.clipboard.writeText(url);
    };
    document.getElementById('btn-leave').onclick = async () => {
      await this.leaveConference();
    };
  }
  // --- end
  constructor() { }

  ngOnInit() {
    // this.main();
  }

}
