import { redirect } from "next/navigation";

export default function TradespersonRegisterPage() {
  redirect("/register?type=tradesperson");
}
