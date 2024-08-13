import Api from './api';

class Auth extends Api {
  constructor() {
    super('');
  }

  public signup = async (username: string, email: string, password: string, firstName: string, lastName: string) => {
    const endpoint = `/users/`;
    const data = { username, email, password, firstName, lastName };

    const response = await this.post(endpoint, data);

    return response;
  };

  public login = async (username: string, password: string) => {
    const endpoint = `/api/token/login/`;
    const data = { username, password };

    const response = await this.post(endpoint, data);

    this.setAccessToken(response.data.access);
    this.setRefreshToken(response.data.refresh);

    return response;
  };


  public logout = async () => {
    this.removeAccessToken();
    this.removeRefreshToken();
  };

  public refreshToken = async () => {
    const refreshToken = this.getRefreshToken();

    const endpoint = `/api/token/refresh/`;
    const config = { headers: { 'x-refresh-token': `Bearer ${refreshToken}` } };

    const response = await this.post(endpoint, null, config);

    this.setAccessToken(response.data.access);

    return response.data.userData;
  };

  public getUserData = async () => {
    const accessToken = this.getAccessToken();

    const endpoint = `/users/user-data`;
    const data = {
      headers: { authorization: `Bearer ${accessToken}` },
    };

    const response = await this.get(endpoint, data);

    return response.data;
  };

//   public updateTokens = async (userId: string) => {
//     const refreshToken = this.getRefreshToken();
//     const accessToken = this.getAccessToken();

//     const endpoint = `/update-tokens`;
//     const data = { userId };
//     const config = {
//       headers: {
//         'x-refresh-token': `Bearer ${refreshToken}`,
//         authorization: `Bearer ${accessToken}`,
//       },
//     };

//     const response = await this.post(endpoint, data, config);

//     this.setAccessToken(response.data.access);
//     this.setRefreshToken(response.data.refresh);

//     return response.data.userData;
//   };

}

export const {
  signup,
  login,
  logout,
  refreshToken,
  getUserData,
//   updateTokens,
} = new Auth();