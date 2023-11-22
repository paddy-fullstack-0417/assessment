import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from '@mui/material';
import { loginWithToken } from '@/store/user.action';

export default function AuthProvider(props: any) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading } = useSelector((store: any) => store.user);

  useEffect(() => {
    const accessToken: string | null = localStorage.getItem('access-token');

    if (accessToken) {
      dispatch(loginWithToken())
        .catch(() => {
          if (router.pathname !== '/user/signup') {
            router.push('/user/login')
          }
        });
    } else {
      if (router.pathname !== '/user/signup') {
        router.push('/user/login')
      }
    }
    // eslint-disable-next-line
  }, [dispatch]);

  return isLoading ? (
    <main className="flex justify-center items-center w-full h-screen">
      <CircularProgress size={72} />
    </main>
  ) : props.children;
}
