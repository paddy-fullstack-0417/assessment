import Head from 'next/head';
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import AdTable from "@/components/AdTable";
import { getProductData } from '@/store/results.action';
import Link from 'next/link';

export default function Home() {
  const dispatch = useDispatch();
  const { data } = useSelector((store: any) => store.results);

  useEffect(() => {
    dispatch(getProductData());
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>Assessment</title>
      </Head>
      <main className="flex flex-col items-center">
        {
          !data ?
            <CircularProgress size={72} className="m-8" />
            : (
              <>
                <div className='my-4'>
                  <Link href={'/user/login'} className='mx-4'>Sign in</Link>
                  <Link href={'/user/signup'} className='mx-4'>Sign up</Link>
                </div>
                
                <h1 className="font-bold text-5xl text-center pt-12">AD DATA</h1>
                <AdTable data={data.list} />
              </>
            )
        }
      </main>
    </>
  )
}
