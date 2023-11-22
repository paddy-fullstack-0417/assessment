import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextField } from "@mui/material";
import { loginWithPassword } from "@/store/user.action";
import Swal from "sweetalert2";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLElement>) => {
    event.preventDefault();

    dispatch(loginWithPassword({ email, password }))
      .then((response: any) => {
        Swal.fire({
          icon: 'success',
          position: 'top-right',
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          text: response.message,
        });

        router.push('/');
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          position: 'top-right',
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          text: 'Credential Error',
        });
      });
  }

  return (
    <main className="flex justify-center items-center w-full h-screen">
      <form className="flex flex-col items-center w-72" onSubmit={handleSubmit}>
        <h1 className="text-3xl mb-8">SIGN IN</h1>

        <TextField
          label="Email"
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
          className="w-full my-2"
          required
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
          className="w-full my-2"
          required
        />

        <Link href={'/user/signup'} className="mt-4">
          Don&apos;t have an account? Sign up
        </Link>

        <Button
          type="submit"
          variant="contained"
          className="w-full h-12 mt-8 bg-gray-700"
        >
          Login
        </Button>
      </form>
    </main>
  );
};

export default LoginPage;
