import { UserEntity } from '@app/user/user.entity';

export type ProfileType = Pick<
  UserEntity,
  'id' | 'username' | 'bio' | 'image'
> & {
  following: boolean;
};
