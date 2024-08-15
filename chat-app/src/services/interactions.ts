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

}

export const {
  sendFriendRequest
} = new Interactions();