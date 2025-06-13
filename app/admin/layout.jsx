"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // Get the current page route

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/my-admin"); // Redirect to login if not signed in
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <p>Loading...</p>; // Show a loading state while checking authentication

  return <>{children}</>;
}
