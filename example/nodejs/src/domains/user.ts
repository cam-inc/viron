export interface User {
  id: string;
  name: string | null;
  nickName: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface UserCreationAttributes {
  name: string | null;
  nickName: string | null;
}
