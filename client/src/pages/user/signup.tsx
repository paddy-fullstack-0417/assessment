import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextField } from "@mui/material";
import { registerUser } from "@/store/user.action";
import Swal from "sweetalert2";
import Link from "next/link";

const SignupPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (event: FormEvent<HTMLElement>) => {
    event.preventDefault();

    dispatch(registerUser({ name, email, password, password2: confirm }))
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
        
        router.push('/user/login');
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          position: 'top-right',
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          text: 'Input Error',
        });
      });
  }

  return (
    <main className="flex justify-center items-center w-full h-screen">
      <form className="flex flex-col items-center w-72" onSubmit={handleSubmit}>
        <h1 className="text-3xl mb-8">SIGN UP</h1>
        
        <TextField
          label="Name"
          value={name}
          onChange={({target:{value}}) => setName(value)}
          className="w-full my-2"
          required
        />
        
        <TextField
          label="Email"
          value={email}
          onChange={({target:{value}}) => setEmail(value)}
          className="w-full my-2"
          required
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={({target:{value}}) => setPassword(value)}
          className="w-full my-2"
          required
        />
        
        <TextField
          label="Confirm Password"
          type="password"
          value={confirm}
          onChange={({target:{value}}) => setConfirm(value)}
          className="w-full my-2"
          required
        />

        <Link href={'/user/login'} className="mt-4">
          Already have an account? Sign in
        </Link>

        <Button
          type="submit"
          variant="contained"
          className="w-full h-12 mt-8 bg-gray-700"
        >
          Register
        </Button>
      </form>
    </main>
  );
};

export default SignupPage;
