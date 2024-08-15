import Api from './api';

class Interactions extends Api {
  constructor() {
    super('');
  }

  public sendFriendRequest = async (username: string) => {
    const accessToken = this.getAccessToken();
    const endpoint = `/users/friend-request/`;
    const config = {
        headers: {
            authorization: `Bearer ${accessToken}`
        }
    }
    const body = {
        "to_user": username
    }
    const response = await this.post(endpoint, body, config);
    return response.data.message;
  }

  public markMessagesAsRead = async (friendId: number) => {
    const accessToken = this.getAccessToken();
    const endpoint = `/chats/chat/${friendId}/mark-all-as-read/`;
    const config = {
        headers: {
            authorization: `Bearer ${accessToken}`
        }
    }
    const response = await this.post(endpoint, {}, config);
    return response.data;
  }

}

export const {
  sendFriendRequest,
  markMessagesAsRead,
} = new Interactions();