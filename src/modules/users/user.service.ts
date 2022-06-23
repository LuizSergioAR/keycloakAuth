import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private http: HttpService) {}

  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) {
    console.log('teste');
    if (password !== passwordConfirmation) {
      throw new HttpException('Different passwords', 400);
    }
    try {
      const { data } = await firstValueFrom(
        this.http.post(
          process.env.HTTP_ADMIN_CLI,
          new URLSearchParams({
            client_id: process.env.CLIENT_ID_ADMIN,
            client_secret: process.env.CLIENT_SECRETE_ADMIN,
            grant_type: process.env.GRANT_TYPE_ADMIN,
          }),
        ),
      );

      await firstValueFrom(
        await this.http.post(
          process.env.HTTP_ADMIN_OR,
          {
            firstName,
            lastName,
            email,
            enabled: 'true',
            username: email,
            credentials: [
              {
                type: 'password',
                value: password,
                temporary: 'false',
              },
            ],
            requiredActions: ['VERIFY_EMAIL'],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.access_token}`,
            },
          },
        ),
      );

      return {
        user: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          username: email,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.response.data.errorMessage,
        error.response.status,
      );
    }
  }

  async getUser(email: string) {
    try {
      const { data } = await firstValueFrom(
        this.http.post(
          process.env.HTTP_ADMIN_CLI,
          new URLSearchParams({
            client_id: process.env.CLIENT_ID_ADMIN,
            client_secret: process.env.CLIENT_SECRETE_ADMIN,
            grant_type: process.env.GRANT_TYPE_ADMIN,
          }),
        ),
      );

      const UserData = await firstValueFrom(
        await this.http.get(`${process.env.HTTP_ADMIN_OR}?username=${email}`, {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        }),
      );

      if (UserData.data.length === 0) {
        throw new HttpException('Could not find user', 400);
      }

      return {
        user: UserData.data,
      };
    } catch (error) {
      throw new HttpException('Could not find user', 400);
    }
  }

  async getUsers() {
    try {
      const { data } = await firstValueFrom(
        this.http.post(
          process.env.HTTP_ADMIN_CLI,
          new URLSearchParams({
            client_id: process.env.CLIENT_ID_ADMIN,
            client_secret: process.env.CLIENT_SECRETE_ADMIN,
            grant_type: process.env.GRANT_TYPE_ADMIN,
          }),
        ),
      );

      const UsersData = await firstValueFrom(
        await this.http.get(`${process.env.HTTP_ADMIN_OR}`, {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        }),
      );

      if (UsersData.data.length === 0) {
        throw new HttpException('Could not find user', 400);
      }

      return {
        users: UsersData.data,
      };
    } catch (error) {
      throw new HttpException('Could not find user', 400);
    }
  }

  async updateUser(
    firstName: string,
    lastName: string,
    email: string,
    id: string,
  ) {
    try {
      const { data } = await firstValueFrom(
        this.http.post(
          process.env.HTTP_ADMIN_CLI,
          new URLSearchParams({
            client_id: process.env.CLIENT_ID_ADMIN,
            client_secret: process.env.CLIENT_SECRETE_ADMIN,
            grant_type: process.env.GRANT_TYPE_ADMIN,
          }),
        ),
      );

      const UserData = await firstValueFrom(
        await this.http.get(`${process.env.HTTP_ADMIN_OR}/${id}`, {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        }),
      );

      if (UserData.data.length === 0) {
        throw new HttpException('Could not find user', 400);
      }

      await firstValueFrom(
        await this.http.put(
          `${process.env.HTTP_ADMIN_OR}/${id}`,
          {
            firstName,
            lastName,
            email,
            enabled: 'true',
            username: email,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data.access_token}`,
            },
          },
        ),
      );

      return {
        message: 'User updated',
      };
    } catch (error) {
      throw new HttpException('Could not find user', 400);
    }
  }

  async deleteUser(id: string) {
    try {
      const { data } = await firstValueFrom(
        this.http.post(
          process.env.HTTP_ADMIN_CLI,
          new URLSearchParams({
            client_id: process.env.CLIENT_ID_ADMIN,
            client_secret: process.env.CLIENT_SECRETE_ADMIN,
            grant_type: process.env.GRANT_TYPE_ADMIN,
          }),
        ),
      );

      const UserData = await firstValueFrom(
        await this.http.get(`${process.env.HTTP_ADMIN_OR}/${id}`, {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        }),
      );

      if (UserData.data.length === 0) {
        throw new HttpException('Could not find user', 400);
      }

      await firstValueFrom(
        await this.http.delete(`${process.env.HTTP_ADMIN_OR}/${id}`, {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        }),
      );

      return {
        user: UserData.data,
      };
    } catch (error) {
      throw new HttpException('Could not find user', 400);
    }
  }
}
