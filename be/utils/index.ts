import {
    UserWithId,
    UserWithoutPassword,
} from '../src/users/schema/user.schema';

export const removePasswordField = (user: UserWithId): UserWithoutPassword => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
