import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      console.log('Connecting to socket...');
      this.socket = io(`${SOCKET_URL}/arena`);
      
      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id);
      });
      
      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinMatch(arenaId, userId, matchId) {
    if (this.socket) {
      this.socket.emit('join_match', { arenaId, userId, matchId });
    }
  }

  updateCode(arenaId, userId, code) {
    if (this.socket) {
      this.socket.emit('code_update', { arenaId, userId, code });
    }
  }

  startMatch(arenaId, matchId) {
    if (this.socket) {
      this.socket.emit('match_start', { arenaId, matchId });
    }
  }

  onCodeUpdate(callback) {
    if (this.socket) {
      this.socket.on('code_update', callback);
    }
  }

  onMatchStart(callback) {
    if (this.socket) {
      this.socket.on('match_start', callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user_joined', callback);
    }
  }

  joinQueue(userId) {
    if (this.socket) {
      this.socket.emit('join_queue', { userId });
    }
  }

  leaveQueue(userId) {
    if (this.socket) {
      this.socket.emit('leave_queue', { userId });
    }
  }

  onMatchFound(callback) {
    if (this.socket) {
      this.socket.on('match_found', callback);
    }
  }

  onMatchEnded(callback) {
    if (this.socket) {
      this.socket.on('match_ended', callback);
    }
  }

  onYouWon(callback) {
    if (this.socket) {
      this.socket.on('you_won', callback);
    }
  }

  onYouLost(callback) {
    if (this.socket) {
      this.socket.on('you_lost', callback);
    }
  }

  sendMessage(arenaId, userId, username, message) {
    if (this.socket) {
      this.socket.emit('send_message', {
        arenaId,
        userId,
        username,
        message,
        timestamp: new Date()
      });
    }
  }

  startTyping(arenaId, userId, username) {
    if (this.socket) {
      this.socket.emit('typing_start', { arenaId, userId, username });
    }
  }

  stopTyping(arenaId, userId, username) {
    if (this.socket) {
      this.socket.emit('typing_stop', { arenaId, userId, username });
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }
}

export default new SocketService();