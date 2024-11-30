import { env } from '@repo/env/client';

export default function Home() {
  return <div className=''>{env.NEXT_PUBLIC_BASE_URL}</div>;
}
