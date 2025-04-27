export interface CreateUserInput {
  email: string;
  password: string;
  role: "ADMIN" | "TRAINER" | "TRAINEE";
  profile?: {
    name: string;
    age: number;
    phone: string;
  };
}
