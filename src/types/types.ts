export type RegisterInput = {
  body: {
    email: string;
    password: string;
  };
};

export type LoginInput = {
  body: {
    email: string;
    password: string;
  };
};

export type UpdateUserInput = {
  body: {
    email?: string;
    password?: string;
  };
  params: {
    id: string;
  };
};
