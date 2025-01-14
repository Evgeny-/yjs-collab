import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Home", description: "Welcome to React Router!" }];
};

export default function Home() {
  return <div>Welcome</div>;
}
