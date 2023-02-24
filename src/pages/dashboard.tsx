import ButtonLoader from "@/components/loaders/button-loader";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const {data, status} = useSession();
  const [loading, setLoading] = useState(status == 'loading');
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && status === 'unauthenticated') {
      signIn('github');
    }
    if (status === "authenticated") {
      setLoading(false)
    }

  }, [status])

  if (loading) {
    return (
      <div>
        <ButtonLoader loading={loading}>
          <h1>Loading ...</h1>
        </ButtonLoader>
      </div>
    );
  }

  return <h1>Dashboard page for {data?.user?.name}</h1>;
}
