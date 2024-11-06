// declare module "@auth/core/types" {
//   interface User {
//     token?: {
//       access_token: string;
//       refresh_token: string;
//     };
//     id: string;
//     email: string;
//     displayName: string;
//     avatar: string;
//   }

//   interface Session {
//     user: Omit<User, "token">;
//     accessToken: string;
//     refreshToken: string;
//     error?: "RefreshTokenError";
//   }
// }

// declare module "@auth/core/jwt" {
//   interface JWT {
//     accessToken: string;
//     refreshToken: string;
//     user: Omit<User, "token">;
//     error?: "RefreshTokenError";
//   }
// }
import { User } from "next-auth";
import "next-auth/jwt";
declare module "next-auth" {
  interface User {
    token?: {
      access_token: string;
      refresh_token: string;
    };
    id: string;
    email: string;
    displayName: string;
    avatar: string;
  }

  interface Session {
    user: Omit<User, "token">;
    accessToken: string;
    refreshToken: string;
    error?: "RefreshTokenError";
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    user: Omit<User, "token">;
    error?: "RefreshTokenError";
  }
}
