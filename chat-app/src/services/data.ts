import Api from './api';

class Data extends Api {
  constructor() {
    super('');
  }

  public getFriendList = async () => {
    const accessToken = this.getAccessToken();
    const endpoint = `/users/friends/`;
    const config = {
        headers: {
            authorization: `Bearer ${accessToken}`
        }
    }

    const response = await this.get(endpoint, config);
    return response.data;
  }

  public getChatLog = async (friendId: number) => {
    const accessToken = this.getAccessToken();
    const endpoint = `/chats/${friendId}/`;
    const config = {
        headers: {
            authorization: `Bearer ${accessToken}`
        }
    }
    const response = await this.get(endpoint, config);
    return response.data;
  }
}

  

export const {
  getFriendList,
  getChatLog,
} = new Data();