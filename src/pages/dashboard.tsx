import ButtonLoader from "@/components/loaders/button-loader";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const securePage = async () => {
      const session = await getSession();
      if (!session) {
        router.push("/api/auth/signin", undefined, {});
      } else {
        setLoading(false);
      }
    };
    securePage();
  });

  if (loading) {
    return (
      <div>
        <ButtonLoader loading={loading}>
          <h1>Loading ...</h1>
        </ButtonLoader>
      </div>
    );
  }

  return <h1>Dashboard page</h1>;
}
