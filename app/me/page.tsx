import { redirect } from "next/navigation";

/** Learner home alias — same as /dashboard */
export default function MePage() {
  redirect("/dashboard");
}
